import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import {
  Canvas,
  Skia,
  Image as SkiaImage,
  useImage,
} from "@shopify/react-native-skia";

import { Services } from "@/utils/services";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppSidebar } from "@/components/AppSidebar";
import { Image } from "expo-image";

import { NavigationHeaderWithBackButton } from "@/components/header/navigation-header-with-back-button";

/*
  Lista de tarefas:
  - arrumar altura do pointer            (Davi) (falhei miseravelmente)
  - verificar quantidade de px (pre-processamento)
  - Endpoint quando completar pintura    (Flyan)
*/

export default function Paint() {

  const { user_id, comic_id, comic_index, comic_status, origin } = useLocalSearchParams();
  const uid = Array.isArray(user_id) ? user_id[0] : user_id;
  const cid = Number(Array.isArray(comic_id) ? comic_id[0] : comic_id);
  const index = Number(Array.isArray(comic_index) ? comic_index[0] : comic_index);
  const status = Array.isArray(comic_status) ? comic_status[0] : comic_status;

  const router = useRouter();

  const [uncoloredImageUri, setUncoloredImageUri] = useState<string>();
  const [coloredImageUri, setColoredImageUri] = useState<string>();
  const [selectedColor, setSelectedColor] = useState<string>();
  const [editedImage, setEditedImage] = useState<any>(null);
  const loadedImage = useImage(uncoloredImageUri ?? "");
  const loadedColoredImage = useImage(coloredImageUri ?? "");
  const image = editedImage ?? loadedImage;
  const [lastingPixels, setLastingPixels] = useState<number>(0);
  // lista das cores disponíveis para pintar
  const [uniqueColors, setUniqueColors] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [path, setPath] = useState<string>(String(status));
  const [painted, setPainted] = useState<boolean>(false);
  const [fetched, setFetched] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const response = await Services.getBothUrlImages(cid, index);
      const colored_image_url = response.colored_image_url;
      const uncolored_image_url = response.uncolored_image_url;
      setColoredImageUri(colored_image_url);
      setUncoloredImageUri(uncolored_image_url);
      const totalColoredPixels = await countColoredPixels(colored_image_url);
      setLastingPixels(totalColoredPixels);
      setFetched(true);
    }
    fetchData();
  }, []);

  useEffect(()=>{
    // console.log(lastingPixels);
    if(!lastingPixels && fetched) {
      setEditedImage(loadedColoredImage);
      async function final() {
        if(status === 'first') {
            const response = await Services.insertComic(uid, cid);
        } 
        else {
            const response = await Services.updateComic(uid, cid, status);
        }  
        setPainted(true);
      }
      final();
    }
  },[lastingPixels])

  useEffect(()=>{
    if(painted) setPath('painted');
  },[painted]);

  useEffect(()=>{
    setSelectedColor(uniqueColors[0])
  },[uniqueColors]);

  function hexToRgb(hex: string) {
    const cleaned = hex.replace("#", "");
    return {
      r: parseInt(cleaned.substring(0, 2), 16),
      g: parseInt(cleaned.substring(2, 4), 16),
      b: parseInt(cleaned.substring(4, 6), 16),
    };
  }

  function rgbToHex(r: number, g: number, b: number) {
    return `#${[r, g, b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")}`.toLowerCase();
  }

  async function countColoredPixels(coloredImageUri: string) {
    const imageData = await Skia.Data.fromURI(coloredImageUri);
    const coloredImage = Skia.Image.MakeImageFromEncoded(imageData);
    if (!coloredImage) return 0;
    
    const pixels = coloredImage.readPixels();
    if (!pixels) return 0;
    

    let count = 0;
    const colorsSet = new Set<string>();
    const PRETO = 20;
    const BRANCO = 235;
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      const isBlack =
        r <= PRETO &&
        g <= PRETO &&
        b <= PRETO;

      const isWhite =
        r >= BRANCO &&
        g >= BRANCO &&
        b >= BRANCO;

      if (!isBlack && !isWhite) {
        count += 1;
        // pixel colorido: salvar a cor em formato hex na lista de cores únicas
        const hex = rgbToHex(r, g, b);
        colorsSet.add(hex);
      }
    }

    const colorsArray = Array.from(colorsSet);
    // atualiza estado de cores únicas: mescla as cores já adicionadas pra não ter duplicatas
    setUniqueColors((prev) => Array.from(new Set([...prev, ...colorsArray])));
    return count;
  }

  // retorna 1 se a cor do pixel da imagem colorida de referência bater com
  // a cor hex atualmente selecionada. Retorna 0 caso contrário.
  function isColorMatching(
    pixels: Uint8Array | Float32Array,
    width: number,
    selectedX: number,
    selectedY: number,
  ) {
    function getIndex(x: number, y: number, w: number) {
      return (y * w + x) * 4;
    }

    // checa bounds básicos do buffer atual
    if (
      selectedX < 0 ||
      selectedY < 0 ||
      selectedX >= width ||
      !pixels
    ) {
      return 0;
    }

    const idx = getIndex(selectedX, selectedY, width);

    if (idx + 2 >= pixels.length) {
      return 0;
    }

    const rReference = pixels[idx];
    const gReference = pixels[idx + 1];
    const bReference = pixels[idx + 2];

    const referenceHex = rgbToHex(rReference, gReference, bReference);
    const selectedHex = selectedColor?.toLowerCase();
    const matches = referenceHex === selectedHex;

    if (matches) {
      return 1;
    }
    return 0;
  }

  function isPaintingAvailable(
    pixels: Uint8Array,
    width: number,
    selectedX: number,
    selectedY: number,
  ) {
    const BRANCO = 235;

    function getIndex(x: number, y: number) {
      return (y * width + x) * 4;
    }

    const idx = getIndex(selectedX, selectedY);

    const r = pixels[idx];
    const g = pixels[idx + 1];
    const b = pixels[idx + 2];

    const isWhite = r >= BRANCO && g >= BRANCO && b >= BRANCO;

    const referencePixels = loadedColoredImage?.readPixels();

    if (!referencePixels || !loadedColoredImage) return false;

    if (!isColorMatching(referencePixels, loadedColoredImage.width(), selectedX, selectedY)) return false; 
    
    if (!isWhite) return false; //pixel diferente de branco
    
      //ver se o pixel é branco na imagem original se for cancela pintura
    return true; //pixel branco pode pintar
  }

  function floodFill(
    pixels: Uint8Array,
    width: number,
    height: number,
    startX: number,
    startY: number,
    hexColor: string
  ) {
    let count = 0;

    const { r: nr, g: ng, b: nb } =
      hexToRgb(hexColor);

    const LIMIAR_BORDA = 150;

    const pilha: [number, number][] =
      [[startX, startY]];

    const visitados = new Set<string>();

    function getIndex(x: number, y: number) {
      return (y * width + x) * 4;
    }

    while (pilha.length > 0) {

      const [x, y] = pilha.pop()!;

      if (
        x < 0 ||
        y < 0 ||
        x >= width ||
        y >= height
      ) {
        continue;
      }

      const key = `${x},${y}`;

      if (visitados.has(key)) {
        continue;
      }

      const idx = getIndex(x, y);

      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];

      if (
        r < LIMIAR_BORDA &&
        g < LIMIAR_BORDA &&
        b < LIMIAR_BORDA
      ) {
        continue;
      }

      pixels[idx] = nr;
      pixels[idx + 1] = ng;
      pixels[idx + 2] = nb;
      pixels[idx + 3] = 255;
      count += 1;

      visitados.add(key);

      pilha.push([x + 1, y]);
      pilha.push([x - 1, y]);
      pilha.push([x, y + 1]);
      pilha.push([x, y - 1]);
    }

    return count;
  }

function handleTouch(x: number, y: number) {

  if(!selectedColor) return;

  if (!image) return;

  const bitmap = image.readPixels();

  if (!bitmap) return;

  // tamanho REAL da imagem
  const imageWidth = image.width();
  const imageHeight = image.height();

  // tamanho VISUAL do canvas
  const canvasWidth = 300;
  const canvasHeight = 300;

  // coordenada proporcional EXATA
  const realX = Math.floor((x / canvasWidth) * imageWidth);
  const realY = Math.floor((y / canvasHeight) * imageHeight);

  // evita coordenadas inválidas
  if (
    realX < 0 ||
    realY < 0 ||
    realX >= imageWidth ||
    realY >= imageHeight
  ) {
    return;
  }

  if (
    !isPaintingAvailable(
      bitmap,
      imageWidth,
      realX,
      realY
    )
  ) {
    return;
  }

  const paintedPixelsCount = floodFill(
    bitmap,
    imageWidth,
    imageHeight,
    realX,
    realY,
    selectedColor
  );

  setLastingPixels((current) => current - paintedPixelsCount);

  const data = Skia.Data.fromBytes(bitmap);

  const newImage = Skia.Image.MakeImage(
    {
      width: imageWidth,
      height: imageHeight,
      alphaType: 3,
      colorType: 4,
    },
    data,
    imageWidth * 4
  );

  if (newImage) {
    setEditedImage(newImage);
  }
}
  return (

    <View style={styles.container}>

    <AppSidebar visible={sidebarOpen} userId={uid} activeRoute="paint" onClose={()=>{setSidebarOpen(false)}}/>

    <NavigationHeaderWithBackButton setSidebarOpenTrue={()=>setSidebarOpen(true)} setSidebarOpenFalse={()=>setSidebarOpen(false)}visible={sidebarOpen} route="paint" userId={uid} push={`/comic?path=${path}&user_id=${uid}&comic_id=${cid}&origin=${origin}`}/>
      
      {image &&
        <View style={styles.subcontainer}>
            <View style={styles.comic}>
                <Canvas style={{ flex: 1 }}>
                    <SkiaImage image={image} x={0} y={0} width={300} height={300} fit="fill"/>
                </Canvas>

                <Pressable style={styles.pressable} onPress={(e) => { const x = e.nativeEvent.locationX;
                                                                      const y = e.nativeEvent.locationY;
                                                                      handleTouch(x, y); }}/>
            </View>
        </View>
      }

      {!!lastingPixels &&
        <View style={styles.colorBarContainer} pointerEvents="box-none">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorBar}
            style={styles.colorBarScroll}
          >
            {uniqueColors.map((c) => (
              <Pressable
                key={c}
                onPress={() => setSelectedColor(c)}
                style={({ pressed }) => [
                  styles.colorDot,
                  { backgroundColor: c },
                  selectedColor === c && styles.colorDotSelected,
                  pressed && { opacity: 0.75 },
                ]}
              />
            ))}
          </ScrollView>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#FCFAEE",
    },
    header: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderBottomWidth: 1,
        borderBottomColor: "#8C8989",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        // gap: 20,
        alignItems: "center",
    },
    menu_hamburguer: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
        },
        line: {
        borderRadius: 999,
        height: 2.5,
        width: 30,
        backgroundColor: "#8C8989"
    },
    arrow: {
        height: 30,
        width: 17
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    subcontainer: {
        display: "flex", 
        justifyContent: "center", 
        alignItems:"center", 
        height: '80%'
    },
    comic: {
        width: 300, 
        height: 300, 
        borderWidth: 2, 
        borderColor: "#8C8989", 
        marginBottom: 50
    },
    canvas: {
        width: 300,
        height: 300,
    },
    pressable: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
    },
    colorBarContainer: {
        position: "absolute",
        padding: 20,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopRightRadius: 60,
        borderTopLeftRadius: 60,
        width: "100%",
        alignItems: "center",
        borderColor: "#8C8989",
        bottom: 0,
        height: 125
    },
    colorBarScroll: {
        backgroundColor: "transparent",
    },
    colorBar: {
        paddingHorizontal: 8,
        alignItems: "center",
    },
    colorDot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: "#00000033",
    },
    colorDotSelected: {
        borderWidth: 2,
        borderColor: "#000",
    },
});