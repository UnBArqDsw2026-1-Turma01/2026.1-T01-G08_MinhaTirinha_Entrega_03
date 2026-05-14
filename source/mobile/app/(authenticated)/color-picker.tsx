/**
 * =====================================================
 * TELA DE PINTURA DE QUADRINHOS (Color Picker)
 * =====================================================
 * 
 * DESCRIÇÃO:
 * Componente que permite o usuário colorir um quadrinho usando flood-fill (balde de tinta).
 * Integra um canvas HTML5 via WebView com controles RN (paleta de cores, botões).
 * 
 * FLUXO DE INTEGRAÇÃO:
 * 1. Tela anterior (library.tsx) passa: id_comic, id_user, uncolored_image_url
 * 2. WebView renderiza canvas com imagem do servidor (via URL pública Supabase)
 * 3. Usuário clica no canvas -> flood-fill aplica cor
 * 4. Usuário clica "Salvar" -> imagem base64 enviada para `onMessage`
 * 5. SaveCommand: upload PNG → Supabase Storage → atualiza tabela Historic
 * 6. Retorna à tela anterior
 * 
 * BANCO DE DADOS (Supabase):
 * - Tabela: Historic
 *   Campos necessários: id_comic, id_user, colored_image_url
 *   Chaves: (id_comic, id_user) como chave composta
 * 
 * - Storage: bucket "colored-comics"
 *   Formato de arquivo: colored-{user_id}-{comic_id}-{timestamp}.png
 */

import React, { useRef, useState } from 'react'
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native'
import { WebView } from 'react-native-webview'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../utils/supabase'

// ---------------------------
// SaveCommand: Padrão Command para upload + atualização de banco
// ---------------------------
// Design Pattern: Command Pattern
// Responsabilidade: encapsular lógica de upload de imagem colorida e atualização do registro
// Benefício: facilita undo/redo e enfileiramento de ações futuras
// 
// INTEGRAÇÃO BACKEND:
// - Upload: Supabase Storage (bucket: colored-comics)
// - Update: Supabase PostgreSQL (tabela: Historic)
// - Campos esperados em Historic: id_comic, id_user, colored_image_url
interface Command { execute(): Promise<void>; undo?(): Promise<void> }

class SaveCommand implements Command {
  private bucket: string
  private path: string
  private base64: string
  private id_comic: string | undefined
  private id_user: string | undefined

  // Recebe: nome do bucket, caminho (filename), imagem em base64, ids para identificar o registro
  constructor(bucket: string, path: string, base64: string, id_comic?: string, id_user?: string) {
    this.bucket = bucket
    this.path = path
    this.base64 = base64
    this.id_comic = id_comic
    this.id_user = id_user
  }

  // BACKEND DEVE OFERECER:
  // Tabela Historic com: (id_comic, id_user) → chave única composta
  // Campo: colored_image_url (string, nullable)
  async execute() {
    // 1. Converte dataURL (base64 PNG) para Blob
    const dataUrl = this.base64
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    
    // 2. Upload para Supabase Storage (bucket: colored-comics)
    //    Caminho esperado: colored-{user_id}-{comic_id}-{timestamp}.png
    //    Arquivo: imagem PNG (255-alfa, 8-bit RGBA)
    const { error: uploadError } = await supabase
      .storage
      .from(this.bucket)
      .upload(this.path, blob, { upsert: true })

    if (uploadError) throw uploadError

    // 3. Obtém URL pública da imagem no storage
    const { data: pub } = await supabase
      .storage
      .from(this.bucket)
      .getPublicUrl(this.path)

    const publicURL = pub.publicUrl

    // 4. Atualiza registro Historic com a URL pública
    //    Query: UPDATE Historic SET colored_image_url = ? 
    //           WHERE id_comic = ? AND id_user = ?
    if (this.id_comic && this.id_user) {
      const { error: updErr } = await supabase
        .from('Historic')
        .update({ colored_image_url: publicURL })
        .match({ id_comic: this.id_comic, id_user: this.id_user })
      if (updErr) throw updErr
    }
  }

  // Undo opcional: remove arquivo do storage e limpa campo no banco
  async undo() {
    try {
      await supabase.storage.from(this.bucket).remove([this.path])
      if (this.id_comic && this.id_user) {
        await supabase.from('Historic').update({ colored_image_url: null }).match({ id_comic: this.id_comic, id_user: this.id_user })
      }
    } catch (e) {
      // não queremos quebrar o app se undo falhar
    }
  }
}

// ---------------------------
// ColorPicker: Componente Principal
// ---------------------------
// Renderiza canvas para pintar quadrinhos usando flood-fill (balde de tinta).
// 
// PARÂMETROS DE ENTRADA (via rota):
// - id_comic (string): identificador único do quadrinho
// - id_user (string): identificador único do usuário
// - uncolored_image_url (string): URL pública (Supabase Storage) da imagem sem cores
//   Formato esperado: image/png
//   Tamanho máximo recomendado: até 2000x2000px
// 
// COMUNICAÇÃO:
// - RN ↔ WebView: via injectJavaScript() + window.ReactNativeWebView.postMessage()
// - Tipos de mensagem: { type: 'save', data: base64-png }
// 
// RETORNO:
// - Ao salvar: atualiza banco (Historic.colored_image_url) e volta à tela anterior
// - Ao cancelar: descarta mudanças e volta
export default function ColorPicker() {
  // FRONTEND: Certifique-se que a rota passa esses parâmetros obrigatoriamente
  // Exemplo: router.push(`/color-picker?id_comic=123&id_user=456&uncolored_image_url=${encodeURIComponent(url)}`)
  const { id_comic, id_user, uncolored_image_url } = useLocalSearchParams()
  const router = useRouter()
  const webviewRef = useRef<WebView | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Bucket Supabase deve existir e ter permissões: upload, read public
  const bucket = 'colored-comics'
  const [commands] = useState<Command[]>([])

  // Paleta padrão (pode ser parametrizada no futuro)
  const palette = ['#FF3B30','#FF9500','#FFCC00','#34C759','#30A7FF','#5856D6','#FF2D55','#8E8E93','#FFFFFF','#000000','#C69C6D','#FFC0CB']

  // HTML/JAVASCRIPT do WebView
  // RESPONSABILIDADES:
  // 1. Carregar imagem PNG (vinda via query param 'src')
  // 2. Renderizar canvas responsivo (até 1000px de largura)
  // 3. Implementar flood-fill (algoritmo scanline) para preenchimento de cores
  // 4. Manter histórico de desenhos (para undo)
  // 5. Expor 3 métodos globais para RN chamar: __rn_setColor, __rn_undo, __rn_save
  // 6. Enviar imagem colorida (PNG base64) via postMessage ao RN
  const html = `
  <!doctype html>
  <html>
  <head>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    html,body{height:100%;margin:0;background:#FCFAEE}
    canvas{max-width:100%;height:auto;display:block;margin:10px auto}
    body{display:flex;flex-direction:column;align-items:center}
  </style>
  </head>
  <body>
  <canvas id="c"></canvas>
  <script>
    // Básico: prepara canvas e carrega a imagem (vinda via query param 'src')
    const canvas = document.getElementById('c')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    const params = new URLSearchParams(location.search)
    const imageUrl = params.get('src')
    let imageHistory = []

    // Cor atual usada pelo flood-fill; default verde
    let currentColor = '#34C759'

    function resizeCanvas(w,h){ canvas.width = w; canvas.height = h }

    img.onload = ()=>{
      // Reduz imagens muito grandes para evitar uso excessivo de memória
      const maxW = Math.min(img.width, 1000)
      const scale = maxW / img.width
      const targetW = Math.floor(img.width * scale)
      const targetH = Math.floor(img.height * scale)
      resizeCanvas(targetW, targetH)
      ctx.drawImage(img, 0, 0, targetW, targetH)
      // snapshot inicial para operações de undo
      imageHistory.push(canvas.toDataURL())
    }
    img.src = imageUrl

    // Helpers do algoritmo de flood-fill (scanline)
    function matchColor(data, idx, r,g,b,a){ return data[idx]==r && data[idx+1]==g && data[idx+2]==b && data[idx+3]==a }
    function colorPixel(data, idx, r,g,b,a){ data[idx]=r; data[idx+1]=g; data[idx+2]=b; data[idx+3]=a }

    function floodFill(x,y, fillColor){
      const w = canvas.width, h = canvas.height
      const imgData = ctx.getImageData(0,0,w,h)
      const data = imgData.data
      const stack = []
      const idx = (Math.floor(y)*w + Math.floor(x)) * 4
      const sr = data[idx], sg = data[idx+1], sb = data[idx+2], sa = data[idx+3]
      const fr = parseInt(fillColor.slice(1,3),16)
      const fg = parseInt(fillColor.slice(3,5),16)
      const fb = parseInt(fillColor.slice(5,7),16)
      const fa = 255
      if (sr===fr && sg===fg && sb===fb) return
      stack.push([Math.floor(x), Math.floor(y)])
      while(stack.length){
        const [nx,ny] = stack.pop()
        let px = nx, py = ny
        let i = (py*w + px)*4
        while(px>=0 && matchColor(data, i, sr,sg,sb,sa)){ px--; i-=4 }
        px++; i+=4
        let reachLeft=false, reachRight=false
        while(px<w && matchColor(data, i, sr,sg,sb,sa)){
          colorPixel(data, i, fr,fg,fb,fa)
          if(py>0){ let up = i - w*4; if(matchColor(data, up, sr,sg,sb,sa) && !reachLeft){ stack.push([px, py-1]); reachLeft=true }} else reachLeft=false
          if(py<h-1){ let down = i + w*4; if(matchColor(data, down, sr,sg,sb,sa) && !reachRight){ stack.push([px, py+1]); reachRight=true }} else reachRight=false
          px++; i+=4
        }
      }
      ctx.putImageData(imgData, 0, 0)
    }

    // Quando o usuário clica no canvas dentro do WebView, aplicamos floodFill
    canvas.addEventListener('click', (ev)=>{
      const rect = canvas.getBoundingClientRect()
      const x = ev.clientX - rect.left
      const y = ev.clientY - rect.top
      imageHistory.push(canvas.toDataURL())
      floodFill(x,y, currentColor)
    })

    // Funções expostas para o RN chamar via injectJavaScript
    window.__rn_setColor = function(c){ currentColor = c }
    window.__rn_undo = function(){ if(imageHistory.length>1){ imageHistory.pop(); const last = imageHistory[imageHistory.length-1]; const i = new Image(); i.onload=()=>{ ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(i,0,0) }; i.src = last } }
    window.__rn_save = function(){ const data = canvas.toDataURL('image/png'); window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'save', data })) }
  </script>
  </body>
  </html>
  `

  // HANDLER: recebe mensagens do WebView
  // Formato esperado: { type: 'save', data: 'data:image/png;base64,iVBOR...' }
  // 
  // FLUXO DE SALVAMENTO:
  // 1. WebView envia base64 PNG
  // 2. RN recebe em onMessage
  // 3. SaveCommand faz upload → Supabase Storage
  // 4. SaveCommand atualiza Historic com URL pública
  // 5. Sucesso: alerta e volta à tela anterior
  // 6. Erro: alerta com mensagem de erro
  // 
  // BACKEND: Certifique-se que:
  // - Storage bucket "colored-comics" existe e permite upload
  // - Tabela Historic tem (id_comic, id_user) como chave única
  // - Campo colored_image_url pode receber URLs
  async function onMessage(e: any) {
    try {
      const payload = JSON.parse(e.nativeEvent.data)
      if (payload.type === 'save') {
        setLoading(true)
        const base64 = payload.data
        const timestamp = Date.now()
        const path = `colored-${id_user || 'anon'}-${id_comic || 'comic'}-${timestamp}.png`
        const cmd = new SaveCommand(bucket, path, base64, id_comic as string | undefined, id_user as string | undefined)
        try {
          await cmd.execute()
          commands.push(cmd)
          Alert.alert('Sucesso', 'Imagem colorida salva com sucesso')
          router.back()
        } catch (err: any) {
          Alert.alert('Erro', String(err.message || err))
        } finally {
          setLoading(false)
        }
      }
    } catch (err) {
      // ignore parsing errors
    }
  }

  // FRONTEND: Normaliza parâmetro de URL
  // expo-router pode passar query params como array ou string
  // Garantimos que imageUrl sempre seja uma string não-vazia
  const imageUrl = Array.isArray(uncolored_image_url) ? uncolored_image_url[0] : (uncolored_image_url ?? '')
  const webviewSrc = encodeURIComponent(imageUrl)

  // COMUNICAÇÃO RN → WebView
  // Cada função injeta JavaScript que chama os métodos expostos no HTML
  // Garante que a cor seja válida (formato hex #RRGGBB) antes de chamar
  function setColor(color: string){ 
    // Executa: window.__rn_setColor('#34C759')
    webviewRef.current?.injectJavaScript(`window.__rn_setColor('${color}'); true;`) 
  }
  
  function undo(){ 
    // Executa: window.__rn_undo() → restaura último snapshot do imageHistory
    webviewRef.current?.injectJavaScript(`window.__rn_undo(); true;`) 
  }
  
  function save(){ 
    // Executa: window.__rn_save() → envia PNG base64 via postMessage
    webviewRef.current?.injectJavaScript(`window.__rn_save(); true;`) 
  }

  // ESTRUTURA DO LAYOUT:
  // - WebView (80%): canvas com imagem e flood-fill interativo
  // - Paleta (nativa RN, ~8%): 12 cores + label
  // - Footer (nativa RN, ~12%): 3 botões (Cancelar, Desfazer, Salvar)
  // 
  // FRONTEND CHECKLIST:
  // ✓ Passar id_comic, id_user, uncolored_image_url via rota
  // ✓ Certifique-se que uncolored_image_url é URL pública (Supabase Storage)
  // ✓ Trate resposta: ao retornar, recarregue dados de Historic se necessário
  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{ html: html, baseUrl: `?src=${webviewSrc}` }}
        onMessage={onMessage}
        style={{ flex: 0.80, width: '100%' }}
      />

      {/* Paleta nativa: ocupa pouco espaço horizontalmente */}
      <View style={styles.paletteContainer}>
        <Text style={styles.paletteLabel}>Cores da marca</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.paletteScroll}>
          {palette.map((c)=> (
            <Pressable key={c} style={[styles.colorDot, { backgroundColor: c }]} onPress={() => setColor(c)} />
          ))}
        </ScrollView>
      </View>

      {/* Rodapé com ações */}
      <View style={styles.footer}>
        <Pressable style={styles.buttonCancel} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </Pressable>
        <Pressable style={styles.buttonUndo} onPress={undo}>
          <Text style={styles.buttonText}>↶ Desfazer</Text>
        </Pressable>
        <Pressable style={styles.buttonSave} onPress={save}>
          <Text style={styles.buttonTextSave}>✓ Salvar</Text>
        </Pressable>
      </View>

      {loading && <View style={styles.loading}><ActivityIndicator size="large" color="#000"/></View>}
    </View>
  )
}

// Estilos organizados e comentados
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFAEE' },
  paletteContainer: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  paletteLabel: { fontSize: 11, color: '#999', marginBottom: 6 },
  paletteScroll: { alignItems: 'center', paddingRight: 8 },
  colorDot: { width: 30, height: 30, borderRadius: 15, marginRight: 10, borderWidth: 1.5, borderColor: '#ddd' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  buttonCancel: { flex: 1, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#f5f5f5', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  buttonUndo: { flex: 1, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fff', borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  buttonSave: { flex: 1, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#34C759', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  buttonText: { fontSize: 13, color: '#333', fontWeight: '600' },
  buttonTextSave: { fontSize: 13, color: '#fff', fontWeight: '700' },
  loading: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }
})

// =====================================================
// GUIA DE INTEGRAÇÃO (Frontend + Backend)
// =====================================================
// 
// FRONTEND (React Native / Expo):
// 1. Chamar ColorPicker com rota:
//    router.push(`/color-picker?id_comic=123&id_user=456&uncolored_image_url=${encodeURIComponent(url)}`)
// 2. id_comic, id_user: strings (identificadores do quadrinho e usuário)
// 3. uncolored_image_url: URL pública do PNG (ex: https://storage.example.com/uncolored.png)
// 4. Após salvar: volta à tela anterior; recarregue dados se necessário
// 
// BACKEND (Supabase):
// 1. Crie storage bucket "colored-comics" com acesso público de leitura
// 2. Tabela "Historic" com campos:
//    - id_comic (string, chave primária composta)
//    - id_user (string, chave primária composta)
//    - colored_image_url (string, nullable)
//    - Restrição: PRIMARY KEY (id_comic, id_user)
// 3. Rotas públicas para Upload/Download funcionarem
// 
// FLUXO TÉCNICO:
// Input: uncolored_image_url (URL pública PNG)
// ↓ (RN carrega em WebView)
// Canvas renderiza e permite pintura com flood-fill
// ↓ (usuário clica "Salvar")
// WebView envia base64 PNG via postMessage
// ↓ (RN recebe em onMessage)
// SaveCommand.execute():
//   1. Converte base64 → Blob
//   2. Upload para Storage: colored-{user}-{comic}-{timestamp}.png
//   3. GetPublicUrl do arquivo
//   4. UPDATE Historic SET colored_image_url = publicUrl WHERE id_comic=? AND id_user=?
// ↓ (sucesso)
// Alert "Imagem colorida salva com sucesso" + volta à tela anterior
// 
// TROUBLESHOOTING:
// - Erro "Missing parameters": Verifique id_comic, id_user, uncolored_image_url
// - Erro "Storage upload failed": Bucket "colored-comics" existe e permite upload?
// - Erro "Update failed": Existe registro em Historic com esse id_comic + id_user?
// - WebView branco: URL de imagem acessível e é PNG válido?

