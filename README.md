# Encuesta para Micaela - calendario corregido

Esta versión mantiene el primer diseño, pero cambia el calendario por el selector nativo de fecha del teléfono.

Esto evita el problema de que el calendario no se vea o no deje avanzar en iOS/Android.

## Personalizar WhatsApp
En `script.js`, buscá:

```js
const phone = "";
```

y poné tu número con código país, por ejemplo:

```js
const phone = "549261XXXXXXXX";
```


## Cambios agregados
- Opción nueva de plan: Cine 🎬
- Música de fondo con el archivo `cancion.weba`
- Botón “Activar música” para que funcione en iOS y Android

Nota: en celulares, por seguridad del navegador, la música no puede arrancar sola sin que la persona toque un botón. Por eso se activa al tocar “Activar música” o “Empezar”.


## Cambios finales
- Se quitó el botón “Activar música”.
- La canción `blue.mp3` se reproduce al tocar “Empezar”.
- Se mantiene la opción Cine 🎬.
