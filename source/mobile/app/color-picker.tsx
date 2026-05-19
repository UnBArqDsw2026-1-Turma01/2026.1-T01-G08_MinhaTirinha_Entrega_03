/**
 * =====================================================
 * TELA DE PINTURA DE QUADRINHOS (Cavalete)
 * =====================================================
 * 
 * DESCRIÇÃO:
 * Interface de pintura onde o usuário interage com os quadrinhos da tirinha.
 * Inclui ferramentas como paleta de cores, histórico de cores recentes e desfazer.
 * 
 * DESIGN:
 * Segue o padrão "Cavalete" com tons pastéis, bordas arredondadas e design limpo.
 */

import React, { useRef, useState } from 'react'
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native'
import { WebView } from 'react-native-webview'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../utils/supabase'

// ---------------------------
// SaveCommand: Padrão Command para upload + atualização de banco
// ---------------------------
interface Command { execute(): Promise<void>; undo?(): Promise<void> }

class SaveCommand implements Command {
  private bucket: string
  private path: string
  private base64: string
  private id_comic: string | undefined
  private id_user: string | undefined

  constructor(bucket: string, path: string, base64: string, id_comic?: string, id_user?: string) {
    this.bucket = bucket
    this.path = path
    this.base64 = base64
    this.id_comic = id_comic
    this.id_user = id_user
  }

  async execute() {
    const dataUrl = this.base64
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    
    const { error: uploadError } = await supabase
      .storage
      .from(this.bucket)
      .upload(this.path, blob, { upsert: true })

    if (uploadError) throw uploadError

    const { data: pub } = await supabase
      .storage
      .from(this.bucket)
      .getPublicUrl(this.path)

    const publicURL = pub.publicUrl

    if (this.id_comic && this.id_user) {
      const { error: updErr } = await supabase
        .from('Historic')
        .update({ colored_image_url: publicURL })
        .match({ id_comic: this.id_comic, id_user: this.id_user })
      if (updErr) throw updErr
    }
  }

  async undo() {
    try {
      await supabase.storage.from(this.bucket).remove([this.path])
      if (this.id_comic && this.id_user) {
        await supabase.from('Historic').update({ colored_image_url: null }).match({ id_comic: this.id_comic, id_user: this.id_user })
      }
    } catch (e) {}
  }
}

export default function ColorPicker() {
  const { id_comic, id_user, uncolored_image_url, comic_title } = useLocalSearchParams()
  const router = useRouter()
  const webviewRef = useRef<WebView | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Mock de painéis (quadrinhos) da tirinha para exibir o progresso
  const panels = [1, 2, 3, 4]
  const currentPanel = 1

  const bucket = 'colored-comics'
  const [commands] = useState<Command[]>([])

  // Paleta padrão e Histórico de Cores Recentes
  const palette = ['#FF3B30','#FF9500','#FFCC00','#34C759','#30A7FF','#5856D6','#FF2D55','#8E8E93','#FFFFFF','#000000','#C69C6D','#FFC0CB']
  const [recentColors, setRecentColors] = useState<string[]>([])

  const html = `
  <!doctype html>
  <html>
  <head>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    html,body{height:100%;margin:0;background:#FFFFFF}
    canvas{max-width:100%;height:auto;display:block;margin:0 auto}
    body{display:flex;flex-direction:column;justify-content:center;align-items:center}
  </style>
  </head>
  <body>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById('c')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    const params = new URLSearchParams(location.search)
    const imageUrl = params.get('src')
    let imageHistory = []
    let currentColor = '#34C759'

    function resizeCanvas(w,h){ canvas.width = w; canvas.height = h }

    img.onload = ()=>{
      const maxW = Math.min(img.width, 1000)
      const scale = maxW / img.width
      const targetW = Math.floor(img.width * scale)
      const targetH = Math.floor(img.height * scale)
      resizeCanvas(targetW, targetH)
      ctx.drawImage(img, 0, 0, targetW, targetH)
      imageHistory.push(canvas.toDataURL())
    }
    img.src = imageUrl

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

    canvas.addEventListener('click', (ev)=>{
      const rect = canvas.getBoundingClientRect()
      const x = ev.clientX - rect.left
      const y = ev.clientY - rect.top
      imageHistory.push(canvas.toDataURL())
      floodFill(x,y, currentColor)
    })

    window.__rn_setColor = function(c){ currentColor = c }
    window.__rn_undo = function(){ if(imageHistory.length>1){ imageHistory.pop(); const last = imageHistory[imageHistory.length-1]; const i = new Image(); i.onload=()=>{ ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(i,0,0) }; i.src = last } }
    window.__rn_save = function(){ const data = canvas.toDataURL('image/png'); window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'save', data })) }
  </script>
  </body>
  </html>
  `

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
    } catch (err) {}
  }

  const imageUrl = Array.isArray(uncolored_image_url) ? uncolored_image_url[0] : (uncolored_image_url ?? '')
  const webviewSrc = encodeURIComponent(imageUrl)

  function setColor(color: string){
    webviewRef.current?.injectJavaScript(`window.__rn_setColor('${color}'); true;`)
  }
  
  function undo(){ 
    webviewRef.current?.injectJavaScript(`window.__rn_undo(); true;`)
  }
  
  function save(){ 
    webviewRef.current?.injectJavaScript(`window.__rn_save(); true;`)
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho do Cavalete e Tira de Quadrinhos */}
      <View style={styles.cavaleteHeader}>
        <Text style={styles.cavaleteTitle}>{comic_title || 'Minha Tirinha'}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.panelsStrip}>
          {panels.map((p) => (
            <View key={p} style={[styles.panelThumbnail, p === currentPanel && styles.activePanel]}>
              <Text style={[styles.panelNumber, p === currentPanel && styles.activePanelText]}>{p}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Área do Canvas (Onde o quadrinho é pintado) */}
      <View style={styles.canvasArea}>
        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ html: html, baseUrl: `?src=${webviewSrc}` }}
          onMessage={onMessage}
          style={styles.webview}
          scrollEnabled={false}
        />
      </View>

      {/* Ferramentas: Paleta e Cores Recentes */}
      <View style={styles.toolsContainer}>
        <View style={styles.paletteContainer}>
          <Text style={styles.paletteLabel}>Paleta de Cores</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.paletteScroll}>
            {palette.map((c)=> (
              <Pressable key={c} style={[styles.colorDot, { backgroundColor: c }]} onPress={() => {
                setColor(c)
                if (!recentColors.includes(c)) {
                  setRecentColors([c, ...recentColors.slice(0, 4)])
                }
              }} />
            ))}
          </ScrollView>
        </View>

        {recentColors.length > 0 && (
          <View style={styles.recentColorsContainer}>
            <Text style={styles.paletteLabel}>Cores Recentes</Text>
            <View style={styles.recentColorsList}>
              {recentColors.map((c, i) => (
                <Pressable key={i} style={[styles.recentColorDot, { backgroundColor: c }]} onPress={() => setColor(c)} />
              ))}
            </View>
          </View>
        )}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFAEE' },
  cavaleteHeader: { paddingVertical: 20, paddingHorizontal: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingTop: 50 },
  cavaleteTitle: { fontSize: 24, fontFamily: 'Iceberg_400Regular', color: '#8C8989', marginBottom: 15 },
  panelsStrip: { gap: 12, paddingRight: 20 },
  panelThumbnail: { width: 50, height: 50, backgroundColor: '#F0F0F0', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DDD' },
  activePanel: { borderColor: '#34C759', borderWidth: 2, backgroundColor: '#E8F5E9' },
  activePanelText: { color: '#34C759' },
  panelNumber: { fontSize: 14, fontWeight: 'bold', color: '#999' },
  canvasArea: { flex: 1, padding: 15, justifyContent: 'center' },
  webview: { flex: 1, borderRadius: 12, backgroundColor: '#FFF', overflow: 'hidden' },
  toolsContainer: { backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE', paddingBottom: 10 },
  paletteContainer: { paddingVertical: 10, paddingHorizontal: 12 },
  paletteLabel: { fontSize: 11, color: '#AAA', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' },
  paletteScroll: { alignItems: 'center', paddingRight: 8 },
  colorDot: { width: 34, height: 34, borderRadius: 17, marginRight: 12, borderWidth: 2, borderColor: '#F0F0F0' },
  recentColorsContainer: { paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: '#FDFDFD', paddingTop: 8 },
  recentColorsList: { flexDirection: 'row', gap: 10 },
  recentColorDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#EEE' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, paddingVertical: 15, paddingHorizontal: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  buttonCancel: { flex: 1, paddingVertical: 12, backgroundColor: '#f5f5f5', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buttonUndo: { flex: 1, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  buttonSave: { flex: 1, paddingVertical: 12, backgroundColor: '#34C759', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buttonText: { fontSize: 14, color: '#333', fontWeight: '600' },
  buttonTextSave: { fontSize: 14, color: '#fff', fontWeight: '700' },
  loading: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }
})
