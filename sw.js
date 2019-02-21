/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "CODE_OF_CONDUCT.md",
    "revision": "c705391b8834a912453248e4d16b2c53"
  },
  {
    "url": "CONTRIBUTING.md",
    "revision": "8afdfbc63fabdaae3c8dac447acc6586"
  },
  {
    "url": "docs/index.html",
    "revision": "fad087f756bea883e37f4484a0e7d4ad"
  },
  {
    "url": "firebase.json",
    "revision": "9f8832c4a73ffb7c677784d0bd4e486f"
  },
  {
    "url": "firestore.indexes.json",
    "revision": "7c66f9c17626f849c92bd1c0caffd514"
  },
  {
    "url": "firestore.rules",
    "revision": "fc029dbd9cab19099a150474dc715e1a"
  },
  {
    "url": "functions/index.js",
    "revision": "10be3e3e7e0ea62663880569677cc5c1"
  },
  {
    "url": "functions/package.json",
    "revision": "585f39bf3f85ad4b079bed67efcb5bb6"
  },
  {
    "url": "images/icons/favicon.ico",
    "revision": "d4e07a75c69175847a5b2339ac92f169"
  },
  {
    "url": "index.html",
    "revision": "aa462f292ac45511d3845c7989f4a509"
  },
  {
    "url": "README.md",
    "revision": "6b588ec70bd168e54d265496cf0142c2"
  },
  {
    "url": "storage.rules",
    "revision": "166a8a900000c71f8e5a5cb4247fa6d4"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
