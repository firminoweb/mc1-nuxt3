import { reactive, hasInjectionContext, getCurrentInstance, version, unref, inject, ref, watchEffect, watch, toRef, isRef, nextTick, shallowRef, shallowReactive, isReadonly, effectScope, markRaw, isReactive, toRaw, computed, getCurrentScope, onScopeDispose, toRefs, isShallow, defineComponent, h, onUnmounted, Fragment, createVNode, Text, Suspense, mergeProps, Transition, provide, withCtx, useSSRContext, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, defineAsyncComponent, createApp } from "vue";
import { $fetch } from "ofetch";
import { useRuntimeConfig as useRuntimeConfig$1 } from "#internal/nitro";
import { createHooks } from "hookable";
import { getContext } from "unctx";
import "destr";
import "devalue";
import { createDefu as createDefu$1, defu } from "defu";
import { klona } from "klona";
import { getActiveHead } from "unhead";
import { defineHeadPlugin, composableNames } from "@unhead/shared";
import { createMemoryHistory, createRouter, START_LOCATION, useRouter as useRouter$1, useRoute as useRoute$1, RouterView } from "vue-router";
import { sanitizeStatusCode, createError as createError$1, getRequestHeaders } from "h3";
import { withQuery, hasProtocol, parseURL, isScriptProtocol, joinURL, isEqual } from "ufo";
import { setupDevtoolsPlugin } from "@vue/devtools-api";
import { extendTailwindMerge } from "tailwind-merge";
import { parse as parse$1, serialize } from "cookie-es";
import "js-cookie";
import isHTTPS from "is-https";
import axios from "axios";
import yaml from "js-yaml";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderSuspense, ssrRenderVNode } from "vue/server-renderer";
const appConfig$1 = useRuntimeConfig$1().app;
const baseURL = () => appConfig$1.baseURL;
const nuxtAppCtx = /* @__PURE__ */ getContext("nuxt-app", {
  asyncContext: false
});
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.7.4";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    runWithContext: (fn) => callWithNuxt(nuxtApp, fn),
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    _payloadRevivers: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    async function contextCaller(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    }
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter$1(nuxtApp, $name, value);
    defineGetter$1(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter$1(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter$1(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
      nuxtApp.ssrContext._payloadReducers = {};
      nuxtApp.payload.path = nuxtApp.ssrContext.url;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b;
  const parallels = [];
  const errors = [];
  for (const plugin2 of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin2.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    const promise = applyPlugin(nuxtApp, plugin2);
    if (plugin2.parallel) {
      parallels.push(promise.catch((e) => errors.push(e)));
    } else {
      await promise;
    }
  }
  await Promise.all(parallels);
  if (errors.length) {
    throw errors[0];
  }
}
/*! @__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
/*! @__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function useNuxtApp() {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
/*! @__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig() {
  return (/* @__PURE__ */ useNuxtApp()).$config;
}
function defineGetter$1(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
version.startsWith("3");
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2, lastKey = "") {
  if (ref2 instanceof Promise)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r, lastKey));
  if (typeof root === "object") {
    return Object.fromEntries(
      Object.entries(root).map(([k, v]) => {
        if (k === "titleTemplate" || k.startsWith("on"))
          return [k, unref(v)];
        return [k, resolveUnrefHeadInput(v, k)];
      })
    );
  }
  return root;
}
defineHeadPlugin({
  hooks: {
    "entries:resolve": function(ctx) {
      for (const entry2 of ctx.entries)
        entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
    }
  }
});
const headSymbol = "usehead";
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey$1 = "__unhead_injection_handler__";
function setHeadInjectionHandler(handler) {
  _global[globalKey$1] = handler;
}
function injectHead() {
  if (globalKey$1 in _global) {
    return _global[globalKey$1]();
  }
  const head = inject(headSymbol);
  if (!head && process.env.NODE_ENV !== "production")
    console.warn("Unhead is missing Vue context, falling back to shared context. This may have unexpected results.");
  return head || getActiveHead();
}
function useHead(input, options = {}) {
  const head = options.head || injectHead();
  if (head) {
    if (!head.ssr)
      return clientUseHead(head, input, options);
    return head.push(input, options);
  }
}
function clientUseHead(head, input, options = {}) {
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input);
  });
  const entry2 = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e) => {
    entry2.patch(e);
  });
  getCurrentInstance();
  return entry2;
}
const coreComposableNames = [
  "injectHead"
];
({
  "@unhead/vue": [...coreComposableNames, ...composableNames]
});
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = /* @__PURE__ */ useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, (/* @__PURE__ */ useNuxtApp())._route);
  }
  return (/* @__PURE__ */ useNuxtApp())._route;
};
/*! @__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const addRouteMiddleware = (name, middleware, options = {}) => {
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  const global2 = options.global || typeof name !== "string";
  const mw = typeof name !== "string" ? name : middleware;
  if (!mw) {
    console.warn("[nuxt] No route middleware passed to `addRouteMiddleware`.", name);
    return;
  }
  if (global2) {
    nuxtApp._middleware.global.push(mw);
  } else {
    nuxtApp._middleware.named[name] = mw;
  }
};
const isProcessingMiddleware = () => {
  try {
    if ((/* @__PURE__ */ useNuxtApp())._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : withQuery(to.path || "/", to.query || {}) + (to.hash || "");
  if (options == null ? void 0 : options.open) {
    return Promise.resolve();
  }
  const isExternal = (options == null ? void 0 : options.external) || hasProtocol(toPath, { acceptRelative: true });
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const protocol = parseURL(toPath).protocol;
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      async function redirect(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(/"/g, "%22");
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: location2 }
        };
        return response;
      }
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    if (options == null ? void 0 : options.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const useError = () => toRef((/* @__PURE__ */ useNuxtApp()).payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const error = useError();
    if (false)
      ;
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const isNuxtError = (err) => !!(err && typeof err === "object" && "__nuxt_error" in err);
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxt = /* @__PURE__ */ useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useRequestHeaders(include) {
  var _a;
  const event = (_a = (/* @__PURE__ */ useNuxtApp()).ssrContext) == null ? void 0 : _a.event;
  const headers = event ? getRequestHeaders(event) : {};
  if (!include) {
    return headers;
  }
  return Object.fromEntries(include.map((key) => key.toLowerCase()).filter((key) => headers[key]).map((key) => [key, headers[key]]));
}
function useRequestEvent(nuxtApp = /* @__PURE__ */ useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
const appLayoutTransition = false;
const appPageTransition = false;
const appKeepalive = false;
function definePayloadReducer(name, reduce) {
  {
    (/* @__PURE__ */ useNuxtApp()).ssrContext._payloadReducers[name] = reduce;
  }
}
function isObject$2(value) {
  return value !== null && typeof value === "object";
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isObject$2(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isObject$2(value) && isObject$2(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defuFn = createDefu((object, key, currentValue) => {
  if (typeof object[key] !== "undefined" && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});
const inlineConfig = {
  "nuxt": {},
  "ui": {
    "primary": "green",
    "gray": "cool",
    "colors": [
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "pink",
      "rose",
      "primary"
    ],
    "strategy": "merge"
  }
};
const appConfig = /* @__PURE__ */ defuFn(inlineConfig);
function useAppConfig() {
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  if (!nuxtApp._appConfig) {
    nuxtApp._appConfig = klona(appConfig);
  }
  return nuxtApp._appConfig;
}
const unhead_KgADcZ0jPj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    setHeadInjectionHandler(
      // need a fresh instance of the nuxt app to avoid parallel requests interfering with each other
      () => (/* @__PURE__ */ useNuxtApp()).vueApp._context.provides.usehead
    );
    nuxtApp.vueApp.use(head);
  }
});
function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
_globalThis$1[globalKey] || (_globalThis$1[globalKey] = createNamespace());
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis$1[asyncHandlersKey] || (_globalThis$1[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}
const _routes = [
  {
    name: "index___en",
    path: "/",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import("./_nuxt/index-9ec7f074.js").then((m) => m.default || m)
  },
  {
    name: "index___es",
    path: "/es",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import("./_nuxt/index-9ec7f074.js").then((m) => m.default || m)
  },
  {
    name: "index___pt",
    path: "/pt",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import("./_nuxt/index-9ec7f074.js").then((m) => m.default || m)
  }
];
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? void 0 : _a.scrollBehaviorType) ?? "auto";
    let position = savedPosition || void 0;
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (!position && from && to && routeAllowsScrollToTop !== false && _isDifferentRoute(from, to)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve2) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await nextTick();
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
        }
        resolve2(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = document.querySelector(selector);
    if (elem) {
      return parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
function _isDifferentRoute(from, to) {
  return to.path !== from.path || JSON.stringify(from.params) !== JSON.stringify(to.params);
}
const configRouterOptions = {};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  {
    return result;
  }
});
const globalMiddleware = [
  validate
];
const namedMiddleware = {
  "fetch-i18n": () => import("./_nuxt/fetch-i18n-2e45eb4c.js")
};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    if (routerOptions.hashMode && !routerBase.includes("#")) {
      routerBase += "#";
    }
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = ((_b = routerOptions.routes) == null ? void 0 : _b.call(routerOptions, _routes)) ?? _routes;
    let startPosition;
    const initialURL = nuxtApp.ssrContext.url;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        var _a2;
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
        return (_a2 = routerOptions.scrollBehavior) == null ? void 0 : _a2.call(routerOptions, to, START_LOCATION, startPosition || savedPosition);
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const _route = shallowRef(router.resolve(initialURL));
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c = from.matched[0]) == null ? void 0 : _c.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key]
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    useError();
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          if (Array.isArray(componentMiddleware)) {
            for (const entry2 of componentMiddleware) {
              middlewareEntries.add(entry2);
            }
          } else {
            middlewareEntries.add(componentMiddleware);
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          const result = await nuxtApp.runWithContext(() => middleware(to, from));
          {
            if (result === false || result instanceof Error) {
              const error2 = result || createError$1({
                statusCode: 404,
                statusMessage: `Page Not Found: ${initialURL}`
              });
              await nuxtApp.runWithContext(() => showError(error2));
              return false;
            }
          }
          if (result === true) {
            continue;
          }
          if (result || result === false) {
            return result;
          }
        }
      }
    });
    router.onError(() => {
      delete nuxtApp._processingMiddleware;
    });
    router.afterEach(async (to, _from, failure) => {
      var _a2;
      delete nuxtApp._processingMiddleware;
      if ((failure == null ? void 0 : failure.type) === 4) {
        return;
      }
      if (to.matched.length === 0 && !((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        await nuxtApp.runWithContext(() => showError(createError$1({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`
        })));
      } else if (to.redirectedFrom && to.fullPath !== initialURL) {
        await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        await router.replace({
          ...router.resolve(initialURL),
          name: void 0,
          // #4920, #4982
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function set(target, key, val) {
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  target[key] = val;
  return val;
}
function del(target, key) {
  if (Array.isArray(target)) {
    target.splice(key, 1);
    return;
  }
  delete target[key];
}
const isVue2 = false;
const isVue3 = true;
/*!
 * pinia v2.1.6
 * (c) 2023 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject$1(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
const IS_CLIENT = false;
const USE_DEVTOOLS = (process.env.NODE_ENV !== "production" || false) && !(process.env.NODE_ENV === "test") && IS_CLIENT;
const saveAs = () => {
};
function toastMessage(message, type) {
  const piniaMessage = "🍍 " + message;
  if (typeof __VUE_DEVTOOLS_TOAST__ === "function") {
    __VUE_DEVTOOLS_TOAST__(piniaMessage, type);
  } else if (type === "error") {
    console.error(piniaMessage);
  } else if (type === "warn") {
    console.warn(piniaMessage);
  } else {
    console.log(piniaMessage);
  }
}
function isPinia(o) {
  return "_a" in o && "install" in o;
}
function checkClipboardAccess() {
  if (!("clipboard" in navigator)) {
    toastMessage(`Your browser doesn't support the Clipboard API`, "error");
    return true;
  }
}
function checkNotFocusedError(error) {
  if (error instanceof Error && error.message.toLowerCase().includes("document is not focused")) {
    toastMessage('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn");
    return true;
  }
  return false;
}
async function actionGlobalCopyState(pinia) {
  if (checkClipboardAccess())
    return;
  try {
    await navigator.clipboard.writeText(JSON.stringify(pinia.state.value));
    toastMessage("Global state copied to clipboard.");
  } catch (error) {
    if (checkNotFocusedError(error))
      return;
    toastMessage(`Failed to serialize the state. Check the console for more details.`, "error");
    console.error(error);
  }
}
async function actionGlobalPasteState(pinia) {
  if (checkClipboardAccess())
    return;
  try {
    loadStoresState(pinia, JSON.parse(await navigator.clipboard.readText()));
    toastMessage("Global state pasted from clipboard.");
  } catch (error) {
    if (checkNotFocusedError(error))
      return;
    toastMessage(`Failed to deserialize the state from clipboard. Check the console for more details.`, "error");
    console.error(error);
  }
}
async function actionGlobalSaveState(pinia) {
  try {
    saveAs(new Blob([JSON.stringify(pinia.state.value)], {
      type: "text/plain;charset=utf-8"
    }), "pinia-state.json");
  } catch (error) {
    toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
    console.error(error);
  }
}
let fileInput;
function getFileOpener() {
  if (!fileInput) {
    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
  }
  function openFile() {
    return new Promise((resolve2, reject) => {
      fileInput.onchange = async () => {
        const files = fileInput.files;
        if (!files)
          return resolve2(null);
        const file = files.item(0);
        if (!file)
          return resolve2(null);
        return resolve2({ text: await file.text(), file });
      };
      fileInput.oncancel = () => resolve2(null);
      fileInput.onerror = reject;
      fileInput.click();
    });
  }
  return openFile;
}
async function actionGlobalOpenStateFile(pinia) {
  try {
    const open = getFileOpener();
    const result = await open();
    if (!result)
      return;
    const { text, file } = result;
    loadStoresState(pinia, JSON.parse(text));
    toastMessage(`Global state imported from "${file.name}".`);
  } catch (error) {
    toastMessage(`Failed to import the state from JSON. Check the console for more details.`, "error");
    console.error(error);
  }
}
function loadStoresState(pinia, state) {
  for (const key in state) {
    const storeState = pinia.state.value[key];
    if (storeState) {
      Object.assign(storeState, state[key]);
    }
  }
}
function formatDisplay(display) {
  return {
    _custom: {
      display
    }
  };
}
const PINIA_ROOT_LABEL = "🍍 Pinia (root)";
const PINIA_ROOT_ID = "_root";
function formatStoreForInspectorTree(store) {
  return isPinia(store) ? {
    id: PINIA_ROOT_ID,
    label: PINIA_ROOT_LABEL
  } : {
    id: store.$id,
    label: store.$id
  };
}
function formatStoreForInspectorState(store) {
  if (isPinia(store)) {
    const storeNames = Array.from(store._s.keys());
    const storeMap = store._s;
    const state2 = {
      state: storeNames.map((storeId) => ({
        editable: true,
        key: storeId,
        value: store.state.value[storeId]
      })),
      getters: storeNames.filter((id) => storeMap.get(id)._getters).map((id) => {
        const store2 = storeMap.get(id);
        return {
          editable: false,
          key: id,
          value: store2._getters.reduce((getters, key) => {
            getters[key] = store2[key];
            return getters;
          }, {})
        };
      })
    };
    return state2;
  }
  const state = {
    state: Object.keys(store.$state).map((key) => ({
      editable: true,
      key,
      value: store.$state[key]
    }))
  };
  if (store._getters && store._getters.length) {
    state.getters = store._getters.map((getterName) => ({
      editable: false,
      key: getterName,
      value: store[getterName]
    }));
  }
  if (store._customProperties.size) {
    state.customProperties = Array.from(store._customProperties).map((key) => ({
      editable: true,
      key,
      value: store[key]
    }));
  }
  return state;
}
function formatEventData(events) {
  if (!events)
    return {};
  if (Array.isArray(events)) {
    return events.reduce((data, event) => {
      data.keys.push(event.key);
      data.operations.push(event.type);
      data.oldValue[event.key] = event.oldValue;
      data.newValue[event.key] = event.newValue;
      return data;
    }, {
      oldValue: {},
      keys: [],
      operations: [],
      newValue: {}
    });
  } else {
    return {
      operation: formatDisplay(events.type),
      key: formatDisplay(events.key),
      oldValue: events.oldValue,
      newValue: events.newValue
    };
  }
}
function formatMutationType(type) {
  switch (type) {
    case MutationType.direct:
      return "mutation";
    case MutationType.patchFunction:
      return "$patch";
    case MutationType.patchObject:
      return "$patch";
    default:
      return "unknown";
  }
}
let isTimelineActive = true;
const componentStateTypes = [];
const MUTATIONS_LAYER_ID = "pinia:mutations";
const INSPECTOR_ID = "pinia";
const { assign: assign$1$1 } = Object;
const getStoreType = (id) => "🍍 " + id;
function registerPiniaDevtools(app, pinia) {
  setupDevtoolsPlugin({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes,
    app
  }, (api) => {
    if (typeof api.now !== "function") {
      toastMessage("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.");
    }
    api.addTimelineLayer({
      id: MUTATIONS_LAYER_ID,
      label: `Pinia 🍍`,
      color: 15064968
    });
    api.addInspector({
      id: INSPECTOR_ID,
      label: "Pinia 🍍",
      icon: "storage",
      treeFilterPlaceholder: "Search stores",
      actions: [
        {
          icon: "content_copy",
          action: () => {
            actionGlobalCopyState(pinia);
          },
          tooltip: "Serialize and copy the state"
        },
        {
          icon: "content_paste",
          action: async () => {
            await actionGlobalPasteState(pinia);
            api.sendInspectorTree(INSPECTOR_ID);
            api.sendInspectorState(INSPECTOR_ID);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            actionGlobalSaveState(pinia);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await actionGlobalOpenStateFile(pinia);
            api.sendInspectorTree(INSPECTOR_ID);
            api.sendInspectorState(INSPECTOR_ID);
          },
          tooltip: "Import the state from a JSON file"
        }
      ],
      nodeActions: [
        {
          icon: "restore",
          tooltip: 'Reset the state (with "$reset")',
          action: (nodeId) => {
            const store = pinia._s.get(nodeId);
            if (!store) {
              toastMessage(`Cannot reset "${nodeId}" store because it wasn't found.`, "warn");
            } else if (typeof store.$reset !== "function") {
              toastMessage(`Cannot reset "${nodeId}" store because it doesn't have a "$reset" method implemented.`, "warn");
            } else {
              store.$reset();
              toastMessage(`Store "${nodeId}" reset.`);
            }
          }
        }
      ]
    });
    api.on.inspectComponent((payload, ctx) => {
      const proxy = payload.componentInstance && payload.componentInstance.proxy;
      if (proxy && proxy._pStores) {
        const piniaStores = payload.componentInstance.proxy._pStores;
        Object.values(piniaStores).forEach((store) => {
          payload.instanceData.state.push({
            type: getStoreType(store.$id),
            key: "state",
            editable: true,
            value: store._isOptionsAPI ? {
              _custom: {
                value: toRaw(store.$state),
                actions: [
                  {
                    icon: "restore",
                    tooltip: "Reset the state of this store",
                    action: () => store.$reset()
                  }
                ]
              }
            } : (
              // NOTE: workaround to unwrap transferred refs
              Object.keys(store.$state).reduce((state, key) => {
                state[key] = store.$state[key];
                return state;
              }, {})
            )
          });
          if (store._getters && store._getters.length) {
            payload.instanceData.state.push({
              type: getStoreType(store.$id),
              key: "getters",
              editable: false,
              value: store._getters.reduce((getters, key) => {
                try {
                  getters[key] = store[key];
                } catch (error) {
                  getters[key] = error;
                }
                return getters;
              }, {})
            });
          }
        });
      }
    });
    api.on.getInspectorTree((payload) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        let stores = [pinia];
        stores = stores.concat(Array.from(pinia._s.values()));
        payload.rootNodes = (payload.filter ? stores.filter((store) => "$id" in store ? store.$id.toLowerCase().includes(payload.filter.toLowerCase()) : PINIA_ROOT_LABEL.toLowerCase().includes(payload.filter.toLowerCase())) : stores).map(formatStoreForInspectorTree);
      }
    });
    api.on.getInspectorState((payload) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
        if (!inspectedStore) {
          return;
        }
        if (inspectedStore) {
          payload.state = formatStoreForInspectorState(inspectedStore);
        }
      }
    });
    api.on.editInspectorState((payload, ctx) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
        if (!inspectedStore) {
          return toastMessage(`store "${payload.nodeId}" not found`, "error");
        }
        const { path } = payload;
        if (!isPinia(inspectedStore)) {
          if (path.length !== 1 || !inspectedStore._customProperties.has(path[0]) || path[0] in inspectedStore.$state) {
            path.unshift("$state");
          }
        } else {
          path.unshift("state");
        }
        isTimelineActive = false;
        payload.set(inspectedStore, path, payload.state.value);
        isTimelineActive = true;
      }
    });
    api.on.editComponentState((payload) => {
      if (payload.type.startsWith("🍍")) {
        const storeId = payload.type.replace(/^🍍\s*/, "");
        const store = pinia._s.get(storeId);
        if (!store) {
          return toastMessage(`store "${storeId}" not found`, "error");
        }
        const { path } = payload;
        if (path[0] !== "state") {
          return toastMessage(`Invalid path for store "${storeId}":
${path}
Only state can be modified.`);
        }
        path[0] = "$state";
        isTimelineActive = false;
        payload.set(store, path, payload.state.value);
        isTimelineActive = true;
      }
    });
  });
}
function addStoreToDevtools(app, store) {
  if (!componentStateTypes.includes(getStoreType(store.$id))) {
    componentStateTypes.push(getStoreType(store.$id));
  }
  setupDevtoolsPlugin({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes,
    app,
    settings: {
      logStoreChanges: {
        label: "Notify about new/deleted stores",
        type: "boolean",
        defaultValue: true
      }
      // useEmojis: {
      //   label: 'Use emojis in messages ⚡️',
      //   type: 'boolean',
      //   defaultValue: true,
      // },
    }
  }, (api) => {
    const now = typeof api.now === "function" ? api.now.bind(api) : Date.now;
    store.$onAction(({ after, onError, name, args }) => {
      const groupId = runningActionId++;
      api.addTimelineEvent({
        layerId: MUTATIONS_LAYER_ID,
        event: {
          time: now(),
          title: "🛫 " + name,
          subtitle: "start",
          data: {
            store: formatDisplay(store.$id),
            action: formatDisplay(name),
            args
          },
          groupId
        }
      });
      after((result) => {
        activeAction = void 0;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now(),
            title: "🛬 " + name,
            subtitle: "end",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name),
              args,
              result
            },
            groupId
          }
        });
      });
      onError((error) => {
        activeAction = void 0;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now(),
            logType: "error",
            title: "💥 " + name,
            subtitle: "end",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name),
              args,
              error
            },
            groupId
          }
        });
      });
    }, true);
    store._customProperties.forEach((name) => {
      watch(() => unref(store[name]), (newValue, oldValue) => {
        api.notifyComponentUpdate();
        api.sendInspectorState(INSPECTOR_ID);
        if (isTimelineActive) {
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now(),
              title: "Change",
              subtitle: name,
              data: {
                newValue,
                oldValue
              },
              groupId: activeAction
            }
          });
        }
      }, { deep: true });
    });
    store.$subscribe(({ events, type }, state) => {
      api.notifyComponentUpdate();
      api.sendInspectorState(INSPECTOR_ID);
      if (!isTimelineActive)
        return;
      const eventData = {
        time: now(),
        title: formatMutationType(type),
        data: assign$1$1({ store: formatDisplay(store.$id) }, formatEventData(events)),
        groupId: activeAction
      };
      if (type === MutationType.patchFunction) {
        eventData.subtitle = "⤵️";
      } else if (type === MutationType.patchObject) {
        eventData.subtitle = "🧩";
      } else if (events && !Array.isArray(events)) {
        eventData.subtitle = events.type;
      }
      if (events) {
        eventData.data["rawEvent(s)"] = {
          _custom: {
            display: "DebuggerEvent",
            type: "object",
            tooltip: "raw DebuggerEvent[]",
            value: events
          }
        };
      }
      api.addTimelineEvent({
        layerId: MUTATIONS_LAYER_ID,
        event: eventData
      });
    }, { detached: true, flush: "sync" });
    const hotUpdate = store._hotUpdate;
    store._hotUpdate = markRaw((newStore) => {
      hotUpdate(newStore);
      api.addTimelineEvent({
        layerId: MUTATIONS_LAYER_ID,
        event: {
          time: now(),
          title: "🔥 " + store.$id,
          subtitle: "HMR update",
          data: {
            store: formatDisplay(store.$id),
            info: formatDisplay(`HMR update`)
          }
        }
      });
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
    });
    const { $dispose } = store;
    store.$dispose = () => {
      $dispose();
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
      api.getSettings().logStoreChanges && toastMessage(`Disposed "${store.$id}" store 🗑`);
    };
    api.notifyComponentUpdate();
    api.sendInspectorTree(INSPECTOR_ID);
    api.sendInspectorState(INSPECTOR_ID);
    api.getSettings().logStoreChanges && toastMessage(`"${store.$id}" store installed 🆕`);
  });
}
let runningActionId = 0;
let activeAction;
function patchActionForGrouping(store, actionNames, wrapWithProxy) {
  const actions = actionNames.reduce((storeActions, actionName) => {
    storeActions[actionName] = toRaw(store)[actionName];
    return storeActions;
  }, {});
  for (const actionName in actions) {
    store[actionName] = function() {
      const _actionId = runningActionId;
      const trackedStore = wrapWithProxy ? new Proxy(store, {
        get(...args) {
          activeAction = _actionId;
          return Reflect.get(...args);
        },
        set(...args) {
          activeAction = _actionId;
          return Reflect.set(...args);
        }
      }) : store;
      activeAction = _actionId;
      const retValue = actions[actionName].apply(trackedStore, arguments);
      activeAction = void 0;
      return retValue;
    };
  }
}
function devtoolsPlugin({ app, store, options }) {
  if (store.$id.startsWith("__hot:")) {
    return;
  }
  store._isOptionsAPI = !!options.state;
  patchActionForGrouping(store, Object.keys(options.actions), store._isOptionsAPI);
  const originalHotUpdate = store._hotUpdate;
  toRaw(store)._hotUpdate = function(newStore) {
    originalHotUpdate.apply(this, arguments);
    patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions), !!store._isOptionsAPI);
  };
  addStoreToDevtools(
    app,
    // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
    store
  );
}
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      setActivePinia(pinia);
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        if (USE_DEVTOOLS) {
          registerPiniaDevtools(app, pinia);
        }
        toBeInstalled.forEach((plugin2) => _p.push(plugin2));
        toBeInstalled = [];
      }
    },
    use(plugin2) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin2);
      } else {
        _p.push(plugin2);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  if (USE_DEVTOOLS && typeof Proxy !== "undefined") {
    pinia.use(devtoolsPlugin);
  }
  return pinia;
}
function patchObject(newState, oldState) {
  for (const key in oldState) {
    const subPatch = oldState[key];
    if (!(key in newState)) {
      continue;
    }
    const targetValue = newState[key];
    if (isPlainObject$1(targetValue) && isPlainObject$1(subPatch) && !isRef(subPatch) && !isReactive(subPatch)) {
      newState[key] = patchObject(targetValue, subPatch);
    } else {
      {
        newState[key] = subPatch;
      }
    }
  }
  return newState;
}
const noop = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  }
  if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject$1(targetValue) && isPlainObject$1(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject$1(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign: assign$2 } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && (!(process.env.NODE_ENV !== "production") || !hot)) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = process.env.NODE_ENV !== "production" && hot ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      toRefs(ref(state ? state() : {}).value)
    ) : toRefs(pinia.state.value[id]);
    return assign$2(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      if (process.env.NODE_ENV !== "production" && name in localState) {
        console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`);
      }
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign$2({ actions: {} }, options);
  if (process.env.NODE_ENV !== "production" && !pinia._e.active) {
    throw new Error("Pinia destroyed");
  }
  const $subscribeOptions = {
    deep: true
    // flush: 'post',
  };
  if (process.env.NODE_ENV !== "production" && !isVue2) {
    $subscribeOptions.onTrigger = (event) => {
      if (isListening) {
        debuggerEvents = event;
      } else if (isListening == false && !store._hotUpdating) {
        if (Array.isArray(debuggerEvents)) {
          debuggerEvents.push(event);
        } else {
          console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.");
        }
      }
    };
  }
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && (!(process.env.NODE_ENV !== "production") || !hot)) {
    {
      pinia.state.value[$id] = {};
    }
  }
  const hotState = ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (process.env.NODE_ENV !== "production") {
      debuggerEvents = [];
    }
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign$2($state, newState);
    });
  } : (
    /* istanbul ignore next */
    process.env.NODE_ENV !== "production" ? () => {
      throw new Error(`🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
    } : noop
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  function wrapAction(name, action) {
    return function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name,
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = action.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
  }
  const _hmrPayload = /* @__PURE__ */ markRaw({
    actions: {},
    getters: {},
    state: [],
    hotState
  });
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign$2({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(process.env.NODE_ENV !== "production" || USE_DEVTOOLS ? assign$2(
    {
      _hmrPayload,
      _customProperties: markRaw(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    partialStore
    // must be added later
    // setupStore
  ) : partialStore);
  pinia._s.set($id, store);
  const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return runWithContext(() => scope.run(setup));
  });
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (process.env.NODE_ENV !== "production" && hot) {
        set(hotState.value, key, toRef(setupStore, key));
      } else if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
      if (process.env.NODE_ENV !== "production") {
        _hmrPayload.state.push(key);
      }
    } else if (typeof prop === "function") {
      const actionValue = process.env.NODE_ENV !== "production" && hot ? prop : wrapAction(key, prop);
      {
        setupStore[key] = actionValue;
      }
      if (process.env.NODE_ENV !== "production") {
        _hmrPayload.actions[key] = prop;
      }
      optionsForPlugin.actions[key] = prop;
    } else if (process.env.NODE_ENV !== "production") {
      if (isComputed(prop)) {
        _hmrPayload.getters[key] = isOptionsStore ? (
          // @ts-expect-error
          options.getters[key]
        ) : prop;
      }
    }
  }
  {
    assign$2(store, setupStore);
    assign$2(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => process.env.NODE_ENV !== "production" && hot ? hotState.value : pinia.state.value[$id],
    set: (state) => {
      if (process.env.NODE_ENV !== "production" && hot) {
        throw new Error("cannot set hotState");
      }
      $patch(($state) => {
        assign$2($state, state);
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    store._hotUpdate = markRaw((newStore) => {
      store._hotUpdating = true;
      newStore._hmrPayload.state.forEach((stateKey) => {
        if (stateKey in store.$state) {
          const newStateTarget = newStore.$state[stateKey];
          const oldStateSource = store.$state[stateKey];
          if (typeof newStateTarget === "object" && isPlainObject$1(newStateTarget) && isPlainObject$1(oldStateSource)) {
            patchObject(newStateTarget, oldStateSource);
          } else {
            newStore.$state[stateKey] = oldStateSource;
          }
        }
        set(store, stateKey, toRef(newStore.$state, stateKey));
      });
      Object.keys(store.$state).forEach((stateKey) => {
        if (!(stateKey in newStore.$state)) {
          del(store, stateKey);
        }
      });
      isListening = false;
      isSyncListening = false;
      pinia.state.value[$id] = toRef(newStore._hmrPayload, "hotState");
      isSyncListening = true;
      nextTick().then(() => {
        isListening = true;
      });
      for (const actionName in newStore._hmrPayload.actions) {
        const action = newStore[actionName];
        set(store, actionName, wrapAction(actionName, action));
      }
      for (const getterName in newStore._hmrPayload.getters) {
        const getter = newStore._hmrPayload.getters[getterName];
        const getterValue = isOptionsStore ? (
          // special handling of options api
          computed(() => {
            setActivePinia(pinia);
            return getter.call(store, store);
          })
        ) : getter;
        set(store, getterName, getterValue);
      }
      Object.keys(store._hmrPayload.getters).forEach((key) => {
        if (!(key in newStore._hmrPayload.getters)) {
          del(store, key);
        }
      });
      Object.keys(store._hmrPayload.actions).forEach((key) => {
        if (!(key in newStore._hmrPayload.actions)) {
          del(store, key);
        }
      });
      store._hmrPayload = newStore._hmrPayload;
      store._getters = newStore._getters;
      store._hotUpdating = false;
    });
  }
  if (USE_DEVTOOLS) {
    const nonEnumerable = {
      writable: true,
      configurable: true,
      // avoid warning on devtools trying to display this property
      enumerable: false
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p) => {
      Object.defineProperty(store, p, assign$2({ value: store[p] }, nonEnumerable));
    });
  }
  pinia._p.forEach((extender) => {
    if (USE_DEVTOOLS) {
      const extensions = scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      }));
      Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
      assign$2(store, extensions);
    } else {
      assign$2(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (process.env.NODE_ENV !== "production" && store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
    console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
  }
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
    if (process.env.NODE_ENV !== "production" && typeof id !== "string") {
      throw new Error(`[🍍]: "defineStore()" must be passed a store id as its first argument.`);
    }
  }
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (process.env.NODE_ENV === "test" && activePinia && activePinia._testing ? null : pinia) || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia)
      setActivePinia(pinia);
    if (process.env.NODE_ENV !== "production" && !activePinia) {
      throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Did you forget to install pinia?
	const pinia = createPinia()
	app.use(pinia)
This will fail in production.`);
    }
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
      if (process.env.NODE_ENV !== "production") {
        useStore._pinia = pinia;
      }
    }
    const store = pinia._s.get(id);
    if (process.env.NODE_ENV !== "production" && hot) {
      const hotId = "__hot:" + id;
      const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia, true) : createOptionsStore(hotId, assign$2({}, options), pinia, true);
      hot._hotUpdate(newStore);
      delete pinia.state.value[hotId];
      pinia._s.delete(hotId);
    }
    if (process.env.NODE_ENV !== "production" && IS_CLIENT) {
      const currentInstance = getCurrentInstance();
      if (currentInstance && currentInstance.proxy && // avoid adding stores that are just built for hot module replacement
      !hot) {
        const vm = currentInstance.proxy;
        const cache2 = "_pStores" in vm ? vm._pStores : vm._pStores = {};
        cache2[id] = store;
      }
    }
    return store;
  }
  useStore.$id = id;
  return useStore;
}
const plugin = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();
  nuxtApp.vueApp.use(pinia);
  setActivePinia(pinia);
  {
    nuxtApp.payload.pinia = pinia.state.value;
  }
  return {
    provide: {
      pinia
    }
  };
});
const reducers = {
  NuxtError: (data) => isNuxtError(data) && data.toJSON(),
  EmptyShallowRef: (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  EmptyRef: (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  ShallowRef: (data) => isRef(data) && isShallow(data) && data.value,
  ShallowReactive: (data) => isReactive(data) && isShallow(data) && toRaw(data),
  Ref: (data) => isRef(data) && data.value,
  Reactive: (data) => isReactive(data) && toRaw(data)
};
const revive_payload_server_eJ33V7gbc6 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const reducer in reducers) {
      definePayloadReducer(reducer, reducers[reducer]);
    }
  }
});
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const customTwMerge = extendTailwindMerge({
  classGroups: {
    icons: [(classPart) => /^i-/.test(classPart)]
  }
});
const defuTwMerge = createDefu$1((obj, key, value, namespace) => {
  if (namespace !== "default" && typeof obj[key] === "string" && typeof value === "string" && obj[key] && value) {
    obj[key] = customTwMerge(obj[key], value);
    return true;
  }
});
function mergeConfig(strategy, ...configs) {
  if (strategy === "override") {
    return defu({}, ...configs);
  }
  return defuTwMerge({}, ...configs);
}
function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(_, r, g, b) {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : null;
}
const _inherit = "inherit";
const _current = "currentColor";
const _transparent = "transparent";
const _black = "#000";
const _white = "#fff";
const _slate = { "50": "#f8fafc", "100": "#f1f5f9", "200": "#e2e8f0", "300": "#cbd5e1", "400": "#94a3b8", "500": "#64748b", "600": "#475569", "700": "#334155", "800": "#1e293b", "900": "#0f172a", "950": "#020617" };
const _gray = { "50": "rgb(var(--color-gray-50) / <alpha-value>)", "100": "rgb(var(--color-gray-100) / <alpha-value>)", "200": "rgb(var(--color-gray-200) / <alpha-value>)", "300": "rgb(var(--color-gray-300) / <alpha-value>)", "400": "rgb(var(--color-gray-400) / <alpha-value>)", "500": "rgb(var(--color-gray-500) / <alpha-value>)", "600": "rgb(var(--color-gray-600) / <alpha-value>)", "700": "rgb(var(--color-gray-700) / <alpha-value>)", "800": "rgb(var(--color-gray-800) / <alpha-value>)", "900": "rgb(var(--color-gray-900) / <alpha-value>)", "950": "rgb(var(--color-gray-950) / <alpha-value>)" };
const _zinc = { "50": "#fafafa", "100": "#f4f4f5", "200": "#e4e4e7", "300": "#d4d4d8", "400": "#a1a1aa", "500": "#71717a", "600": "#52525b", "700": "#3f3f46", "800": "#27272a", "900": "#18181b", "950": "#09090b" };
const _neutral = { "50": "#fafafa", "100": "#f5f5f5", "200": "#e5e5e5", "300": "#d4d4d4", "400": "#a3a3a3", "500": "#737373", "600": "#525252", "700": "#404040", "800": "#262626", "900": "#171717", "950": "#0a0a0a" };
const _stone = { "50": "#fafaf9", "100": "#f5f5f4", "200": "#e7e5e4", "300": "#d6d3d1", "400": "#a8a29e", "500": "#78716c", "600": "#57534e", "700": "#44403c", "800": "#292524", "900": "#1c1917", "950": "#0c0a09" };
const _red = { "50": "#fef2f2", "100": "#fee2e2", "200": "#fecaca", "300": "#fca5a5", "400": "#f87171", "500": "#ef4444", "600": "#dc2626", "700": "#b91c1c", "800": "#991b1b", "900": "#7f1d1d", "950": "#450a0a" };
const _orange = { "50": "#fff7ed", "100": "#ffedd5", "200": "#fed7aa", "300": "#fdba74", "400": "#fb923c", "500": "#f97316", "600": "#ea580c", "700": "#c2410c", "800": "#9a3412", "900": "#7c2d12", "950": "#431407" };
const _amber = { "50": "#fffbeb", "100": "#fef3c7", "200": "#fde68a", "300": "#fcd34d", "400": "#fbbf24", "500": "#f59e0b", "600": "#d97706", "700": "#b45309", "800": "#92400e", "900": "#78350f", "950": "#451a03" };
const _yellow = { "50": "#fefce8", "100": "#fef9c3", "200": "#fef08a", "300": "#fde047", "400": "#facc15", "500": "#eab308", "600": "#ca8a04", "700": "#a16207", "800": "#854d0e", "900": "#713f12", "950": "#422006" };
const _lime = { "50": "#f7fee7", "100": "#ecfccb", "200": "#d9f99d", "300": "#bef264", "400": "#a3e635", "500": "#84cc16", "600": "#65a30d", "700": "#4d7c0f", "800": "#3f6212", "900": "#365314", "950": "#1a2e05" };
const _green = { "50": "#f0fdf4", "100": "#dcfce7", "200": "#bbf7d0", "300": "#86efac", "400": "#4ade80", "500": "#22c55e", "600": "#16a34a", "700": "#15803d", "800": "#166534", "900": "#14532d", "950": "#052e16" };
const _emerald = { "50": "#ecfdf5", "100": "#d1fae5", "200": "#a7f3d0", "300": "#6ee7b7", "400": "#34d399", "500": "#10b981", "600": "#059669", "700": "#047857", "800": "#065f46", "900": "#064e3b", "950": "#022c22" };
const _teal = { "50": "#f0fdfa", "100": "#ccfbf1", "200": "#99f6e4", "300": "#5eead4", "400": "#2dd4bf", "500": "#14b8a6", "600": "#0d9488", "700": "#0f766e", "800": "#115e59", "900": "#134e4a", "950": "#042f2e" };
const _cyan = { "50": "#ecfeff", "100": "#cffafe", "200": "#a5f3fc", "300": "#67e8f9", "400": "#22d3ee", "500": "#06b6d4", "600": "#0891b2", "700": "#0e7490", "800": "#155e75", "900": "#164e63", "950": "#083344" };
const _sky = { "50": "#f0f9ff", "100": "#e0f2fe", "200": "#bae6fd", "300": "#7dd3fc", "400": "#38bdf8", "500": "#0ea5e9", "600": "#0284c7", "700": "#0369a1", "800": "#075985", "900": "#0c4a6e", "950": "#082f49" };
const _blue = { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" };
const _indigo = { "50": "#eef2ff", "100": "#e0e7ff", "200": "#c7d2fe", "300": "#a5b4fc", "400": "#818cf8", "500": "#6366f1", "600": "#4f46e5", "700": "#4338ca", "800": "#3730a3", "900": "#312e81", "950": "#1e1b4b" };
const _violet = { "50": "#f5f3ff", "100": "#ede9fe", "200": "#ddd6fe", "300": "#c4b5fd", "400": "#a78bfa", "500": "#8b5cf6", "600": "#7c3aed", "700": "#6d28d9", "800": "#5b21b6", "900": "#4c1d95", "950": "#2e1065" };
const _purple = { "50": "#faf5ff", "100": "#f3e8ff", "200": "#e9d5ff", "300": "#d8b4fe", "400": "#c084fc", "500": "#a855f7", "600": "#9333ea", "700": "#7e22ce", "800": "#6b21a8", "900": "#581c87", "950": "#3b0764" };
const _fuchsia = { "50": "#fdf4ff", "100": "#fae8ff", "200": "#f5d0fe", "300": "#f0abfc", "400": "#e879f9", "500": "#d946ef", "600": "#c026d3", "700": "#a21caf", "800": "#86198f", "900": "#701a75", "950": "#4a044e" };
const _pink = { "50": "#fdf2f8", "100": "#fce7f3", "200": "#fbcfe8", "300": "#f9a8d4", "400": "#f472b6", "500": "#ec4899", "600": "#db2777", "700": "#be185d", "800": "#9d174d", "900": "#831843", "950": "#500724" };
const _rose = { "50": "#fff1f2", "100": "#ffe4e6", "200": "#fecdd3", "300": "#fda4af", "400": "#fb7185", "500": "#f43f5e", "600": "#e11d48", "700": "#be123c", "800": "#9f1239", "900": "#881337", "950": "#4c0519" };
const _primary = { "50": "rgb(var(--color-primary-50) / <alpha-value>)", "100": "rgb(var(--color-primary-100) / <alpha-value>)", "200": "rgb(var(--color-primary-200) / <alpha-value>)", "300": "rgb(var(--color-primary-300) / <alpha-value>)", "400": "rgb(var(--color-primary-400) / <alpha-value>)", "500": "rgb(var(--color-primary-500) / <alpha-value>)", "600": "rgb(var(--color-primary-600) / <alpha-value>)", "700": "rgb(var(--color-primary-700) / <alpha-value>)", "800": "rgb(var(--color-primary-800) / <alpha-value>)", "900": "rgb(var(--color-primary-900) / <alpha-value>)", "950": "rgb(var(--color-primary-950) / <alpha-value>)", "DEFAULT": "rgb(var(--color-primary-DEFAULT) / <alpha-value>)" };
const _cool = { "50": "#f9fafb", "100": "#f3f4f6", "200": "#e5e7eb", "300": "#d1d5db", "400": "#9ca3af", "500": "#6b7280", "600": "#4b5563", "700": "#374151", "800": "#1f2937", "900": "#111827", "950": "#030712" };
const config = { "inherit": _inherit, "current": _current, "transparent": _transparent, "black": _black, "white": _white, "slate": _slate, "gray": _gray, "zinc": _zinc, "neutral": _neutral, "stone": _stone, "red": _red, "orange": _orange, "amber": _amber, "yellow": _yellow, "lime": _lime, "green": _green, "emerald": _emerald, "teal": _teal, "cyan": _cyan, "sky": _sky, "blue": _blue, "indigo": _indigo, "violet": _violet, "purple": _purple, "fuchsia": _fuchsia, "pink": _pink, "rose": _rose, "primary": _primary, "cool": _cool };
const colors_244lXBzhnM = /* @__PURE__ */ defineNuxtPlugin(() => {
  const appConfig2 = useAppConfig();
  const root = computed(() => {
    const primary = config[appConfig2.ui.primary];
    const gray = config[appConfig2.ui.gray];
    if (!primary) {
      console.warn(`[@nuxt/ui] Primary color '${appConfig2.ui.primary}' not found in Tailwind config`);
    }
    if (!gray) {
      console.warn(`[@nuxt/ui] Gray color '${appConfig2.ui.gray}' not found in Tailwind config`);
    }
    return `:root {
${Object.entries(primary || config.green).map(([key, value]) => `--color-primary-${key}: ${hexToRgb(value)};`).join("\n")}
--color-primary-DEFAULT: var(--color-primary-500);

${Object.entries(gray || config.cool).map(([key, value]) => `--color-gray-${key}: ${hexToRgb(value)};`).join("\n")}
}

.dark {
  --color-primary-DEFAULT: var(--color-primary-400);
}
`;
  });
  const headData = {
    style: [{
      innerHTML: () => root.value,
      tagPriority: -2,
      id: "nuxt-ui-colors"
    }]
  };
  useHead(headData);
});
const preference = "system";
const plugin_server_XNCxeHyTuP = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const colorMode = useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  {
    useHead({ htmlAttrs });
  }
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      colorMode.value = htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
const composition_sLxaNGmlSL = /* @__PURE__ */ defineNuxtPlugin(() => {
});
/*!
  * shared v9.5.0
  * (c) 2023 kazuya kawaguchi
  * Released under the MIT License.
  */
const inBrowser = false;
let mark;
let measure;
if (process.env.NODE_ENV !== "production")
  ;
const RE_ARGS = /\{([0-9a-zA-Z]+)\}/g;
function format$1(message, ...args) {
  if (args.length === 1 && isObject$1(args[0])) {
    args = args[0];
  }
  if (!args || !args.hasOwnProperty) {
    args = {};
  }
  return message.replace(RE_ARGS, (match, identifier) => {
    return args.hasOwnProperty(identifier) ? args[identifier] : "";
  });
}
const makeSymbol$1 = (name, shareable = false) => !shareable ? Symbol(name) : Symbol.for(name);
const generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({ l: locale, k: key, s: source });
const friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
const isNumber = (val) => typeof val === "number" && isFinite(val);
const isDate = (val) => toTypeString(val) === "[object Date]";
const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
const isEmptyObject = (val) => isPlainObject(val) && Object.keys(val).length === 0;
const assign$1 = Object.assign;
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {});
};
function escapeHtml(rawText) {
  return rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
const isArray$1 = Array.isArray;
const isFunction$1 = (val) => typeof val === "function";
const isString$1 = (val) => typeof val === "string";
const isBoolean = (val) => typeof val === "boolean";
const isObject$1 = (val) => val !== null && typeof val === "object";
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const isPlainObject = (val) => {
  if (!isObject$1(val))
    return false;
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto.constructor === Object;
};
const toDisplayString = (val) => {
  return val == null ? "" : isArray$1(val) || isPlainObject(val) && val.toString === objectToString ? JSON.stringify(val, null, 2) : String(val);
};
function join(items, separator = "") {
  return items.reduce((str, item, index) => index === 0 ? str + item : str + separator + item, "");
}
const RANGE = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
  const lines = source.split(/\r?\n/);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + 1;
    if (count >= start) {
      for (let j = i - RANGE; j <= i + RANGE || end > count; j++) {
        if (j < 0 || j >= lines.length)
          continue;
        const line = j + 1;
        res.push(`${line}${" ".repeat(3 - String(line).length)}|  ${lines[j]}`);
        const lineLength = lines[j].length;
        if (j === i) {
          const pad = start - (count - lineLength) + 1;
          const length = Math.max(1, end > count ? lineLength - pad : end - start);
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + 1;
        }
      }
      break;
    }
  }
  return res.join("\n");
}
function incrementer(code2) {
  let current = code2;
  return () => ++current;
}
function warn$1(msg, err) {
  if (typeof console !== "undefined") {
    console.warn(`[intlify] ` + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}
const hasWarned = {};
function warnOnce(msg) {
  if (!hasWarned[msg]) {
    hasWarned[msg] = true;
    warn$1(msg);
  }
}
function createEmitter() {
  const events = /* @__PURE__ */ new Map();
  const emitter = {
    events,
    on(event, handler) {
      const handlers = events.get(event);
      const added = handlers && handlers.push(handler);
      if (!added) {
        events.set(event, [handler]);
      }
    },
    off(event, handler) {
      const handlers = events.get(event);
      if (handlers) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1);
      }
    },
    emit(event, payload) {
      (events.get(event) || []).slice().map((handler) => handler(payload));
      (events.get("*") || []).slice().map((handler) => handler(event, payload));
    }
  };
  return emitter;
}
/*!
  * message-compiler v9.5.0
  * (c) 2023 kazuya kawaguchi
  * Released under the MIT License.
  */
function createPosition(line, column, offset) {
  return { line, column, offset };
}
function createLocation(start, end, source) {
  const loc = { start, end };
  if (source != null) {
    loc.source = source;
  }
  return loc;
}
const CompileErrorCodes = {
  // tokenizer error codes
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,
  // parser error codes
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14,
  // generator error codes
  UNHANDLED_CODEGEN_NODE_TYPE: 15,
  // minifier error codes
  UNHANDLED_MINIFIER_NODE_TYPE: 16,
  // Special value for higher-order compilers to pick up the last code
  // to avoid collision of error codes. This should always be kept as the last
  // item.
  __EXTEND_POINT__: 17
};
const errorMessages$2 = {
  // tokenizer error messages
  [CompileErrorCodes.EXPECTED_TOKEN]: `Expected token: '{0}'`,
  [CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER]: `Invalid token in placeholder: '{0}'`,
  [CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]: `Unterminated single quote in placeholder`,
  [CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE]: `Unknown escape sequence: \\{0}`,
  [CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE]: `Invalid unicode escape sequence: {0}`,
  [CompileErrorCodes.UNBALANCED_CLOSING_BRACE]: `Unbalanced closing brace`,
  [CompileErrorCodes.UNTERMINATED_CLOSING_BRACE]: `Unterminated closing brace`,
  [CompileErrorCodes.EMPTY_PLACEHOLDER]: `Empty placeholder`,
  [CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER]: `Not allowed nest placeholder`,
  [CompileErrorCodes.INVALID_LINKED_FORMAT]: `Invalid linked format`,
  // parser error messages
  [CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL]: `Plural must have messages`,
  [CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER]: `Unexpected empty linked modifier`,
  [CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY]: `Unexpected empty linked key`,
  [CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS]: `Unexpected lexical analysis in token: '{0}'`,
  // generator error messages
  [CompileErrorCodes.UNHANDLED_CODEGEN_NODE_TYPE]: `unhandled codegen node type: '{0}'`,
  // minimizer error messages
  [CompileErrorCodes.UNHANDLED_MINIFIER_NODE_TYPE]: `unhandled mimifier node type: '{0}'`
};
function createCompileError(code2, loc, options = {}) {
  const { domain, messages, args } = options;
  const msg = process.env.NODE_ENV !== "production" ? format$1((messages || errorMessages$2)[code2] || "", ...args || []) : code2;
  const error = new SyntaxError(String(msg));
  error.code = code2;
  if (loc) {
    error.location = loc;
  }
  error.domain = domain;
  return error;
}
function defaultOnError(error) {
  throw error;
}
const RE_HTML_TAG = /<\/?[\w\s="/.':;#-\/]+>/;
const detectHtmlTag = (source) => RE_HTML_TAG.test(source);
const CHAR_SP = " ";
const CHAR_CR = "\r";
const CHAR_LF = "\n";
const CHAR_LS = String.fromCharCode(8232);
const CHAR_PS = String.fromCharCode(8233);
function createScanner(str) {
  const _buf = str;
  let _index = 0;
  let _line = 1;
  let _column = 1;
  let _peekOffset = 0;
  const isCRLF = (index2) => _buf[index2] === CHAR_CR && _buf[index2 + 1] === CHAR_LF;
  const isLF = (index2) => _buf[index2] === CHAR_LF;
  const isPS = (index2) => _buf[index2] === CHAR_PS;
  const isLS = (index2) => _buf[index2] === CHAR_LS;
  const isLineEnd = (index2) => isCRLF(index2) || isLF(index2) || isPS(index2) || isLS(index2);
  const index = () => _index;
  const line = () => _line;
  const column = () => _column;
  const peekOffset = () => _peekOffset;
  const charAt = (offset) => isCRLF(offset) || isPS(offset) || isLS(offset) ? CHAR_LF : _buf[offset];
  const currentChar = () => charAt(_index);
  const currentPeek = () => charAt(_index + _peekOffset);
  function next() {
    _peekOffset = 0;
    if (isLineEnd(_index)) {
      _line++;
      _column = 0;
    }
    if (isCRLF(_index)) {
      _index++;
    }
    _index++;
    _column++;
    return _buf[_index];
  }
  function peek() {
    if (isCRLF(_index + _peekOffset)) {
      _peekOffset++;
    }
    _peekOffset++;
    return _buf[_index + _peekOffset];
  }
  function reset() {
    _index = 0;
    _line = 1;
    _column = 1;
    _peekOffset = 0;
  }
  function resetPeek(offset = 0) {
    _peekOffset = offset;
  }
  function skipToPeek() {
    const target = _index + _peekOffset;
    while (target !== _index) {
      next();
    }
    _peekOffset = 0;
  }
  return {
    index,
    line,
    column,
    peekOffset,
    charAt,
    currentChar,
    currentPeek,
    next,
    peek,
    reset,
    resetPeek,
    skipToPeek
  };
}
const EOF = void 0;
const DOT = ".";
const LITERAL_DELIMITER = "'";
const ERROR_DOMAIN$3 = "tokenizer";
function createTokenizer(source, options = {}) {
  const location2 = options.location !== false;
  const _scnr = createScanner(source);
  const currentOffset = () => _scnr.index();
  const currentPosition = () => createPosition(_scnr.line(), _scnr.column(), _scnr.index());
  const _initLoc = currentPosition();
  const _initOffset = currentOffset();
  const _context = {
    currentType: 14,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: 14,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc,
    braceNest: 0,
    inLinked: false,
    text: ""
  };
  const context = () => _context;
  const { onError } = options;
  function emitError(code2, pos, offset, ...args) {
    const ctx = context();
    pos.column += offset;
    pos.offset += offset;
    if (onError) {
      const loc = location2 ? createLocation(ctx.startLoc, pos) : null;
      const err = createCompileError(code2, loc, {
        domain: ERROR_DOMAIN$3,
        args
      });
      onError(err);
    }
  }
  function getToken(context2, type, value) {
    context2.endLoc = currentPosition();
    context2.currentType = type;
    const token = { type };
    if (location2) {
      token.loc = createLocation(context2.startLoc, context2.endLoc);
    }
    if (value != null) {
      token.value = value;
    }
    return token;
  }
  const getEndToken = (context2) => getToken(
    context2,
    14
    /* TokenTypes.EOF */
  );
  function eat(scnr, ch) {
    if (scnr.currentChar() === ch) {
      scnr.next();
      return ch;
    } else {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
      return "";
    }
  }
  function peekSpaces(scnr) {
    let buf = "";
    while (scnr.currentPeek() === CHAR_SP || scnr.currentPeek() === CHAR_LF) {
      buf += scnr.currentPeek();
      scnr.peek();
    }
    return buf;
  }
  function skipSpaces(scnr) {
    const buf = peekSpaces(scnr);
    scnr.skipToPeek();
    return buf;
  }
  function isIdentifierStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc === 95;
  }
  function isNumberStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function isNamedIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isListIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ch = scnr.currentPeek() === "-" ? scnr.peek() : scnr.currentPeek();
    const ret = isNumberStart(ch);
    scnr.resetPeek();
    return ret;
  }
  function isLiteralStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === LITERAL_DELIMITER;
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDotStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 8) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ".";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedModifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 9) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDelimiterStart(scnr, context2) {
    const { currentType } = context2;
    if (!(currentType === 8 || currentType === 12)) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ":";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedReferStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 10) {
      return false;
    }
    const fn = () => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return isIdentifierStart(scnr.peek());
      } else if (ch === "@" || ch === "%" || ch === "|" || ch === ":" || ch === "." || ch === CHAR_SP || !ch) {
        return false;
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn();
      } else {
        return isIdentifierStart(ch);
      }
    };
    const ret = fn();
    scnr.resetPeek();
    return ret;
  }
  function isPluralStart(scnr) {
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === "|";
    scnr.resetPeek();
    return ret;
  }
  function detectModuloStart(scnr) {
    const spaces = peekSpaces(scnr);
    const ret = scnr.currentPeek() === "%" && scnr.peek() === "{";
    scnr.resetPeek();
    return {
      isModulo: ret,
      hasSpace: spaces.length > 0
    };
  }
  function isTextStart(scnr, reset = true) {
    const fn = (hasSpace = false, prev = "", detectModulo = false) => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return prev === "%" ? false : hasSpace;
      } else if (ch === "@" || !ch) {
        return prev === "%" ? true : hasSpace;
      } else if (ch === "%") {
        scnr.peek();
        return fn(hasSpace, "%", true);
      } else if (ch === "|") {
        return prev === "%" || detectModulo ? true : !(prev === CHAR_SP || prev === CHAR_LF);
      } else if (ch === CHAR_SP) {
        scnr.peek();
        return fn(true, CHAR_SP, detectModulo);
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn(true, CHAR_LF, detectModulo);
      } else {
        return true;
      }
    };
    const ret = fn();
    reset && scnr.resetPeek();
    return ret;
  }
  function takeChar(scnr, fn) {
    const ch = scnr.currentChar();
    if (ch === EOF) {
      return EOF;
    }
    if (fn(ch)) {
      scnr.next();
      return ch;
    }
    return null;
  }
  function takeIdentifierChar(scnr) {
    const closure = (ch) => {
      const cc = ch.charCodeAt(0);
      return cc >= 97 && cc <= 122 || // a-z
      cc >= 65 && cc <= 90 || // A-Z
      cc >= 48 && cc <= 57 || // 0-9
      cc === 95 || // _
      cc === 36;
    };
    return takeChar(scnr, closure);
  }
  function takeDigit(scnr) {
    const closure = (ch) => {
      const cc = ch.charCodeAt(0);
      return cc >= 48 && cc <= 57;
    };
    return takeChar(scnr, closure);
  }
  function takeHexDigit(scnr) {
    const closure = (ch) => {
      const cc = ch.charCodeAt(0);
      return cc >= 48 && cc <= 57 || // 0-9
      cc >= 65 && cc <= 70 || // A-F
      cc >= 97 && cc <= 102;
    };
    return takeChar(scnr, closure);
  }
  function getDigits(scnr) {
    let ch = "";
    let num = "";
    while (ch = takeDigit(scnr)) {
      num += ch;
    }
    return num;
  }
  function readModulo(scnr) {
    skipSpaces(scnr);
    const ch = scnr.currentChar();
    if (ch !== "%") {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
    }
    scnr.next();
    return "%";
  }
  function readText(scnr) {
    let buf = "";
    while (true) {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "}" || ch === "@" || ch === "|" || !ch) {
        break;
      } else if (ch === "%") {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else {
          break;
        }
      } else if (ch === CHAR_SP || ch === CHAR_LF) {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else if (isPluralStart(scnr)) {
          break;
        } else {
          buf += ch;
          scnr.next();
        }
      } else {
        buf += ch;
        scnr.next();
      }
    }
    return buf;
  }
  function readNamedIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let name = "";
    while (ch = takeIdentifierChar(scnr)) {
      name += ch;
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return name;
  }
  function readListIdentifier(scnr) {
    skipSpaces(scnr);
    let value = "";
    if (scnr.currentChar() === "-") {
      scnr.next();
      value += `-${getDigits(scnr)}`;
    } else {
      value += getDigits(scnr);
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return value;
  }
  function readLiteral(scnr) {
    skipSpaces(scnr);
    eat(scnr, `'`);
    let ch = "";
    let literal = "";
    const fn = (x) => x !== LITERAL_DELIMITER && x !== CHAR_LF;
    while (ch = takeChar(scnr, fn)) {
      if (ch === "\\") {
        literal += readEscapeSequence(scnr);
      } else {
        literal += ch;
      }
    }
    const current = scnr.currentChar();
    if (current === CHAR_LF || current === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, currentPosition(), 0);
      if (current === CHAR_LF) {
        scnr.next();
        eat(scnr, `'`);
      }
      return literal;
    }
    eat(scnr, `'`);
    return literal;
  }
  function readEscapeSequence(scnr) {
    const ch = scnr.currentChar();
    switch (ch) {
      case "\\":
      case `'`:
        scnr.next();
        return `\\${ch}`;
      case "u":
        return readUnicodeEscapeSequence(scnr, ch, 4);
      case "U":
        return readUnicodeEscapeSequence(scnr, ch, 6);
      default:
        emitError(CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE, currentPosition(), 0, ch);
        return "";
    }
  }
  function readUnicodeEscapeSequence(scnr, unicode, digits) {
    eat(scnr, unicode);
    let sequence = "";
    for (let i = 0; i < digits; i++) {
      const ch = takeHexDigit(scnr);
      if (!ch) {
        emitError(CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE, currentPosition(), 0, `\\${unicode}${sequence}${scnr.currentChar()}`);
        break;
      }
      sequence += ch;
    }
    return `\\${unicode}${sequence}`;
  }
  function readInvalidIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let identifiers = "";
    const closure = (ch2) => ch2 !== "{" && ch2 !== "}" && ch2 !== CHAR_SP && ch2 !== CHAR_LF;
    while (ch = takeChar(scnr, closure)) {
      identifiers += ch;
    }
    return identifiers;
  }
  function readLinkedModifier(scnr) {
    let ch = "";
    let name = "";
    while (ch = takeIdentifierChar(scnr)) {
      name += ch;
    }
    return name;
  }
  function readLinkedRefer(scnr) {
    const fn = (detect = false, buf) => {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "%" || ch === "@" || ch === "|" || ch === "(" || ch === ")" || !ch) {
        return buf;
      } else if (ch === CHAR_SP) {
        return buf;
      } else if (ch === CHAR_LF || ch === DOT) {
        buf += ch;
        scnr.next();
        return fn(detect, buf);
      } else {
        buf += ch;
        scnr.next();
        return fn(true, buf);
      }
    };
    return fn(false, "");
  }
  function readPlural(scnr) {
    skipSpaces(scnr);
    const plural = eat(
      scnr,
      "|"
      /* TokenChars.Pipe */
    );
    skipSpaces(scnr);
    return plural;
  }
  function readTokenInPlaceholder(scnr, context2) {
    let token = null;
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        if (context2.braceNest >= 1) {
          emitError(CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          2,
          "{"
          /* TokenChars.BraceLeft */
        );
        skipSpaces(scnr);
        context2.braceNest++;
        return token;
      case "}":
        if (context2.braceNest > 0 && context2.currentType === 2) {
          emitError(CompileErrorCodes.EMPTY_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
        context2.braceNest--;
        context2.braceNest > 0 && skipSpaces(scnr);
        if (context2.inLinked && context2.braceNest === 0) {
          context2.inLinked = false;
        }
        return token;
      case "@":
        if (context2.braceNest > 0) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
        }
        token = readTokenInLinked(scnr, context2) || getEndToken(context2);
        context2.braceNest = 0;
        return token;
      default:
        let validNamedIdentifier = true;
        let validListIdentifier = true;
        let validLiteral = true;
        if (isPluralStart(scnr)) {
          if (context2.braceNest > 0) {
            emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          }
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (context2.braceNest > 0 && (context2.currentType === 5 || context2.currentType === 6 || context2.currentType === 7)) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          context2.braceNest = 0;
          return readToken(scnr, context2);
        }
        if (validNamedIdentifier = isNamedIdentifierStart(scnr, context2)) {
          token = getToken(context2, 5, readNamedIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validListIdentifier = isListIdentifierStart(scnr, context2)) {
          token = getToken(context2, 6, readListIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validLiteral = isLiteralStart(scnr, context2)) {
          token = getToken(context2, 7, readLiteral(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
          token = getToken(context2, 13, readInvalidIdentifier(scnr));
          emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, token.value);
          skipSpaces(scnr);
          return token;
        }
        break;
    }
    return token;
  }
  function readTokenInLinked(scnr, context2) {
    const { currentType } = context2;
    let token = null;
    const ch = scnr.currentChar();
    if ((currentType === 8 || currentType === 9 || currentType === 12 || currentType === 10) && (ch === CHAR_LF || ch === CHAR_SP)) {
      emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
    }
    switch (ch) {
      case "@":
        scnr.next();
        token = getToken(
          context2,
          8,
          "@"
          /* TokenChars.LinkedAlias */
        );
        context2.inLinked = true;
        return token;
      case ".":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          9,
          "."
          /* TokenChars.LinkedDot */
        );
      case ":":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          10,
          ":"
          /* TokenChars.LinkedDelimiter */
        );
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isLinkedDotStart(scnr, context2) || isLinkedDelimiterStart(scnr, context2)) {
          skipSpaces(scnr);
          return readTokenInLinked(scnr, context2);
        }
        if (isLinkedModifierStart(scnr, context2)) {
          skipSpaces(scnr);
          return getToken(context2, 12, readLinkedModifier(scnr));
        }
        if (isLinkedReferStart(scnr, context2)) {
          skipSpaces(scnr);
          if (ch === "{") {
            return readTokenInPlaceholder(scnr, context2) || token;
          } else {
            return getToken(context2, 11, readLinkedRefer(scnr));
          }
        }
        if (currentType === 8) {
          emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
        }
        context2.braceNest = 0;
        context2.inLinked = false;
        return readToken(scnr, context2);
    }
  }
  function readToken(scnr, context2) {
    let token = {
      type: 14
      /* TokenTypes.EOF */
    };
    if (context2.braceNest > 0) {
      return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
    }
    if (context2.inLinked) {
      return readTokenInLinked(scnr, context2) || getEndToken(context2);
    }
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
      case "}":
        emitError(CompileErrorCodes.UNBALANCED_CLOSING_BRACE, currentPosition(), 0);
        scnr.next();
        return getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
      case "@":
        return readTokenInLinked(scnr, context2) || getEndToken(context2);
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        const { isModulo, hasSpace } = detectModuloStart(scnr);
        if (isModulo) {
          return hasSpace ? getToken(context2, 0, readText(scnr)) : getToken(context2, 4, readModulo(scnr));
        }
        if (isTextStart(scnr)) {
          return getToken(context2, 0, readText(scnr));
        }
        break;
    }
    return token;
  }
  function nextToken() {
    const { currentType, offset, startLoc, endLoc } = _context;
    _context.lastType = currentType;
    _context.lastOffset = offset;
    _context.lastStartLoc = startLoc;
    _context.lastEndLoc = endLoc;
    _context.offset = currentOffset();
    _context.startLoc = currentPosition();
    if (_scnr.currentChar() === EOF) {
      return getToken(
        _context,
        14
        /* TokenTypes.EOF */
      );
    }
    return readToken(_scnr, _context);
  }
  return {
    nextToken,
    currentOffset,
    currentPosition,
    context
  };
}
const ERROR_DOMAIN$2 = "parser";
const KNOWN_ESCAPES = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
function fromEscapeSequence(match, codePoint4, codePoint6) {
  switch (match) {
    case `\\\\`:
      return `\\`;
    case `\\'`:
      return `'`;
    default: {
      const codePoint = parseInt(codePoint4 || codePoint6, 16);
      if (codePoint <= 55295 || codePoint >= 57344) {
        return String.fromCodePoint(codePoint);
      }
      return "�";
    }
  }
}
function createParser(options = {}) {
  const location2 = options.location !== false;
  const { onError } = options;
  function emitError(tokenzer, code2, start, offset, ...args) {
    const end = tokenzer.currentPosition();
    end.offset += offset;
    end.column += offset;
    if (onError) {
      const loc = location2 ? createLocation(start, end) : null;
      const err = createCompileError(code2, loc, {
        domain: ERROR_DOMAIN$2,
        args
      });
      onError(err);
    }
  }
  function startNode(type, offset, loc) {
    const node = { type };
    if (location2) {
      node.start = offset;
      node.end = offset;
      node.loc = { start: loc, end: loc };
    }
    return node;
  }
  function endNode(node, offset, pos, type) {
    if (type) {
      node.type = type;
    }
    if (location2) {
      node.end = offset;
      if (node.loc) {
        node.loc.end = pos;
      }
    }
  }
  function parseText(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(3, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseList(tokenizer, index) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(5, offset, loc);
    node.index = parseInt(index, 10);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseNamed(tokenizer, key) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(4, offset, loc);
    node.key = key;
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLiteral(tokenizer, value) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(9, offset, loc);
    node.value = value.replace(KNOWN_ESCAPES, fromEscapeSequence);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinkedModifier(tokenizer) {
    const token = tokenizer.nextToken();
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(8, offset, loc);
    if (token.type !== 12) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER, context.lastStartLoc, 0);
      node.value = "";
      endNode(node, offset, loc);
      return {
        nextConsumeToken: token,
        node
      };
    }
    if (token.value == null) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    node.value = token.value || "";
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node
    };
  }
  function parseLinkedKey(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(7, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinked(tokenizer) {
    const context = tokenizer.context();
    const linkedNode = startNode(6, context.offset, context.startLoc);
    let token = tokenizer.nextToken();
    if (token.type === 9) {
      const parsed = parseLinkedModifier(tokenizer);
      linkedNode.modifier = parsed.node;
      token = parsed.nextConsumeToken || tokenizer.nextToken();
    }
    if (token.type !== 10) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    token = tokenizer.nextToken();
    if (token.type === 2) {
      token = tokenizer.nextToken();
    }
    switch (token.type) {
      case 11:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLinkedKey(tokenizer, token.value || "");
        break;
      case 5:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseNamed(tokenizer, token.value || "");
        break;
      case 6:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseList(tokenizer, token.value || "");
        break;
      case 7:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLiteral(tokenizer, token.value || "");
        break;
      default:
        emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY, context.lastStartLoc, 0);
        const nextContext = tokenizer.context();
        const emptyLinkedKeyNode = startNode(7, nextContext.offset, nextContext.startLoc);
        emptyLinkedKeyNode.value = "";
        endNode(emptyLinkedKeyNode, nextContext.offset, nextContext.startLoc);
        linkedNode.key = emptyLinkedKeyNode;
        endNode(linkedNode, nextContext.offset, nextContext.startLoc);
        return {
          nextConsumeToken: token,
          node: linkedNode
        };
    }
    endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node: linkedNode
    };
  }
  function parseMessage(tokenizer) {
    const context = tokenizer.context();
    const startOffset = context.currentType === 1 ? tokenizer.currentOffset() : context.offset;
    const startLoc = context.currentType === 1 ? context.endLoc : context.startLoc;
    const node = startNode(2, startOffset, startLoc);
    node.items = [];
    let nextToken = null;
    do {
      const token = nextToken || tokenizer.nextToken();
      nextToken = null;
      switch (token.type) {
        case 0:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseText(tokenizer, token.value || ""));
          break;
        case 6:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseList(tokenizer, token.value || ""));
          break;
        case 5:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseNamed(tokenizer, token.value || ""));
          break;
        case 7:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseLiteral(tokenizer, token.value || ""));
          break;
        case 8:
          const parsed = parseLinked(tokenizer);
          node.items.push(parsed.node);
          nextToken = parsed.nextConsumeToken || null;
          break;
      }
    } while (context.currentType !== 14 && context.currentType !== 1);
    const endOffset = context.currentType === 1 ? context.lastOffset : tokenizer.currentOffset();
    const endLoc = context.currentType === 1 ? context.lastEndLoc : tokenizer.currentPosition();
    endNode(node, endOffset, endLoc);
    return node;
  }
  function parsePlural(tokenizer, offset, loc, msgNode) {
    const context = tokenizer.context();
    let hasEmptyMessage = msgNode.items.length === 0;
    const node = startNode(1, offset, loc);
    node.cases = [];
    node.cases.push(msgNode);
    do {
      const msg = parseMessage(tokenizer);
      if (!hasEmptyMessage) {
        hasEmptyMessage = msg.items.length === 0;
      }
      node.cases.push(msg);
    } while (context.currentType !== 14);
    if (hasEmptyMessage) {
      emitError(tokenizer, CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL, loc, 0);
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseResource(tokenizer) {
    const context = tokenizer.context();
    const { offset, startLoc } = context;
    const msgNode = parseMessage(tokenizer);
    if (context.currentType === 14) {
      return msgNode;
    } else {
      return parsePlural(tokenizer, offset, startLoc, msgNode);
    }
  }
  function parse2(source) {
    const tokenizer = createTokenizer(source, assign$1({}, options));
    const context = tokenizer.context();
    const node = startNode(0, context.offset, context.startLoc);
    if (location2 && node.loc) {
      node.loc.source = source;
    }
    node.body = parseResource(tokenizer);
    if (options.onCacheKey) {
      node.cacheKey = options.onCacheKey(source);
    }
    if (context.currentType !== 14) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, source[context.offset] || "");
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  return { parse: parse2 };
}
function getTokenCaption(token) {
  if (token.type === 14) {
    return "EOF";
  }
  const name = (token.value || "").replace(/\r?\n/gu, "\\n");
  return name.length > 10 ? name.slice(0, 9) + "…" : name;
}
function createTransformer(ast, options = {}) {
  const _context = {
    ast,
    helpers: /* @__PURE__ */ new Set()
  };
  const context = () => _context;
  const helper = (name) => {
    _context.helpers.add(name);
    return name;
  };
  return { context, helper };
}
function traverseNodes(nodes, transformer) {
  for (let i = 0; i < nodes.length; i++) {
    traverseNode(nodes[i], transformer);
  }
}
function traverseNode(node, transformer) {
  switch (node.type) {
    case 1:
      traverseNodes(node.cases, transformer);
      transformer.helper(
        "plural"
        /* HelperNameMap.PLURAL */
      );
      break;
    case 2:
      traverseNodes(node.items, transformer);
      break;
    case 6:
      const linked = node;
      traverseNode(linked.key, transformer);
      transformer.helper(
        "linked"
        /* HelperNameMap.LINKED */
      );
      transformer.helper(
        "type"
        /* HelperNameMap.TYPE */
      );
      break;
    case 5:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "list"
        /* HelperNameMap.LIST */
      );
      break;
    case 4:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "named"
        /* HelperNameMap.NAMED */
      );
      break;
  }
}
function transform(ast, options = {}) {
  const transformer = createTransformer(ast);
  transformer.helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  );
  ast.body && traverseNode(ast.body, transformer);
  const context = transformer.context();
  ast.helpers = Array.from(context.helpers);
}
function optimize(ast) {
  const body = ast.body;
  if (body.type === 2) {
    optimizeMessageNode(body);
  } else {
    body.cases.forEach((c) => optimizeMessageNode(c));
  }
  return ast;
}
function optimizeMessageNode(message) {
  if (message.items.length === 1) {
    const item = message.items[0];
    if (item.type === 3 || item.type === 9) {
      message.static = item.value;
      delete item.value;
    }
  } else {
    const values = [];
    for (let i = 0; i < message.items.length; i++) {
      const item = message.items[i];
      if (!(item.type === 3 || item.type === 9)) {
        break;
      }
      if (item.value == null) {
        break;
      }
      values.push(item.value);
    }
    if (values.length === message.items.length) {
      message.static = join(values);
      for (let i = 0; i < message.items.length; i++) {
        const item = message.items[i];
        if (item.type === 3 || item.type === 9) {
          delete item.value;
        }
      }
    }
  }
}
const ERROR_DOMAIN$1 = "minifier";
function minify(node) {
  node.t = node.type;
  switch (node.type) {
    case 0:
      const resource = node;
      minify(resource.body);
      resource.b = resource.body;
      delete resource.body;
      break;
    case 1:
      const plural = node;
      const cases = plural.cases;
      for (let i = 0; i < cases.length; i++) {
        minify(cases[i]);
      }
      plural.c = cases;
      delete plural.cases;
      break;
    case 2:
      const message = node;
      const items = message.items;
      for (let i = 0; i < items.length; i++) {
        minify(items[i]);
      }
      message.i = items;
      delete message.items;
      if (message.static) {
        message.s = message.static;
        delete message.static;
      }
      break;
    case 3:
    case 9:
    case 8:
    case 7:
      const valueNode = node;
      if (valueNode.value) {
        valueNode.v = valueNode.value;
        delete valueNode.value;
      }
      break;
    case 6:
      const linked = node;
      minify(linked.key);
      linked.k = linked.key;
      delete linked.key;
      if (linked.modifier) {
        minify(linked.modifier);
        linked.m = linked.modifier;
        delete linked.modifier;
      }
      break;
    case 5:
      const list = node;
      list.i = list.index;
      delete list.index;
      break;
    case 4:
      const named = node;
      named.k = named.key;
      delete named.key;
      break;
    default:
      if (process.env.NODE_ENV !== "production") {
        throw createCompileError(CompileErrorCodes.UNHANDLED_MINIFIER_NODE_TYPE, null, {
          domain: ERROR_DOMAIN$1,
          args: [node.type]
        });
      }
  }
  delete node.type;
}
const ERROR_DOMAIN = "parser";
function createCodeGenerator(ast, options) {
  const { sourceMap, filename, breakLineCode, needIndent: _needIndent } = options;
  const location2 = options.location !== false;
  const _context = {
    filename,
    code: "",
    column: 1,
    line: 1,
    offset: 0,
    map: void 0,
    breakLineCode,
    needIndent: _needIndent,
    indentLevel: 0
  };
  if (location2 && ast.loc) {
    _context.source = ast.loc.source;
  }
  const context = () => _context;
  function push(code2, node) {
    _context.code += code2;
  }
  function _newline(n, withBreakLine = true) {
    const _breakLineCode = withBreakLine ? breakLineCode : "";
    push(_needIndent ? _breakLineCode + `  `.repeat(n) : _breakLineCode);
  }
  function indent(withNewLine = true) {
    const level = ++_context.indentLevel;
    withNewLine && _newline(level);
  }
  function deindent(withNewLine = true) {
    const level = --_context.indentLevel;
    withNewLine && _newline(level);
  }
  function newline() {
    _newline(_context.indentLevel);
  }
  const helper = (key) => `_${key}`;
  const needIndent = () => _context.needIndent;
  return {
    context,
    push,
    indent,
    deindent,
    newline,
    helper,
    needIndent
  };
}
function generateLinkedNode(generator, node) {
  const { helper } = generator;
  generator.push(`${helper(
    "linked"
    /* HelperNameMap.LINKED */
  )}(`);
  generateNode(generator, node.key);
  if (node.modifier) {
    generator.push(`, `);
    generateNode(generator, node.modifier);
    generator.push(`, _type`);
  } else {
    generator.push(`, undefined, _type`);
  }
  generator.push(`)`);
}
function generateMessageNode(generator, node) {
  const { helper, needIndent } = generator;
  generator.push(`${helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  )}([`);
  generator.indent(needIndent());
  const length = node.items.length;
  for (let i = 0; i < length; i++) {
    generateNode(generator, node.items[i]);
    if (i === length - 1) {
      break;
    }
    generator.push(", ");
  }
  generator.deindent(needIndent());
  generator.push("])");
}
function generatePluralNode(generator, node) {
  const { helper, needIndent } = generator;
  if (node.cases.length > 1) {
    generator.push(`${helper(
      "plural"
      /* HelperNameMap.PLURAL */
    )}([`);
    generator.indent(needIndent());
    const length = node.cases.length;
    for (let i = 0; i < length; i++) {
      generateNode(generator, node.cases[i]);
      if (i === length - 1) {
        break;
      }
      generator.push(", ");
    }
    generator.deindent(needIndent());
    generator.push(`])`);
  }
}
function generateResource(generator, node) {
  if (node.body) {
    generateNode(generator, node.body);
  } else {
    generator.push("null");
  }
}
function generateNode(generator, node) {
  const { helper } = generator;
  switch (node.type) {
    case 0:
      generateResource(generator, node);
      break;
    case 1:
      generatePluralNode(generator, node);
      break;
    case 2:
      generateMessageNode(generator, node);
      break;
    case 6:
      generateLinkedNode(generator, node);
      break;
    case 8:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 7:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 5:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "list"
        /* HelperNameMap.LIST */
      )}(${node.index}))`, node);
      break;
    case 4:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "named"
        /* HelperNameMap.NAMED */
      )}(${JSON.stringify(node.key)}))`, node);
      break;
    case 9:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 3:
      generator.push(JSON.stringify(node.value), node);
      break;
    default:
      if (process.env.NODE_ENV !== "production") {
        throw createCompileError(CompileErrorCodes.UNHANDLED_CODEGEN_NODE_TYPE, null, {
          domain: ERROR_DOMAIN,
          args: [node.type]
        });
      }
  }
}
const generate = (ast, options = {}) => {
  const mode = isString$1(options.mode) ? options.mode : "normal";
  const filename = isString$1(options.filename) ? options.filename : "message.intl";
  const sourceMap = !!options.sourceMap;
  const breakLineCode = options.breakLineCode != null ? options.breakLineCode : mode === "arrow" ? ";" : "\n";
  const needIndent = options.needIndent ? options.needIndent : mode !== "arrow";
  const helpers = ast.helpers || [];
  const generator = createCodeGenerator(ast, {
    mode,
    filename,
    sourceMap,
    breakLineCode,
    needIndent
  });
  generator.push(mode === "normal" ? `function __msg__ (ctx) {` : `(ctx) => {`);
  generator.indent(needIndent);
  if (helpers.length > 0) {
    generator.push(`const { ${join(helpers.map((s) => `${s}: _${s}`), ", ")} } = ctx`);
    generator.newline();
  }
  generator.push(`return `);
  generateNode(generator, ast);
  generator.deindent(needIndent);
  generator.push(`}`);
  delete ast.helpers;
  const { code: code2, map } = generator.context();
  return {
    ast,
    code: code2,
    map: map ? map.toJSON() : void 0
    // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};
function baseCompile$1(source, options = {}) {
  const assignedOptions = assign$1({}, options);
  const jit = !!assignedOptions.jit;
  const enalbeMinify = !!assignedOptions.minify;
  const enambeOptimize = assignedOptions.optimize == null ? true : assignedOptions.optimize;
  const parser = createParser(assignedOptions);
  const ast = parser.parse(source);
  if (!jit) {
    transform(ast, assignedOptions);
    return generate(ast, assignedOptions);
  } else {
    enambeOptimize && optimize(ast);
    enalbeMinify && minify(ast);
    return { ast, code: "" };
  }
}
/*!
  * core-base v9.5.0
  * (c) 2023 kazuya kawaguchi
  * Released under the MIT License.
  */
function initFeatureFlags$1() {
  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }
}
const pathStateMachine = [];
pathStateMachine[
  0
  /* States.BEFORE_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    0
    /* States.BEFORE_PATH */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  1
  /* States.IN_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1
    /* States.IN_PATH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  2
  /* States.BEFORE_IDENT */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  3
  /* States.IN_IDENT */
] = {
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1,
    1
    /* Actions.PUSH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2,
    1
    /* Actions.PUSH */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    1
    /* Actions.PUSH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7,
    1
    /* Actions.PUSH */
  ]
};
pathStateMachine[
  4
  /* States.IN_SUB_PATH */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ],
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ],
  [
    "]"
    /* PathCharTypes.RIGHT_BRACKET */
  ]: [
    1,
    3
    /* Actions.PUSH_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  5
  /* States.IN_SINGLE_QUOTE */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  6
  /* States.IN_DOUBLE_QUOTE */
] = {
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ]
};
const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral(exp) {
  return literalValueRE.test(exp);
}
function stripQuotes(str) {
  const a = str.charCodeAt(0);
  const b = str.charCodeAt(str.length - 1);
  return a === b && (a === 34 || a === 39) ? str.slice(1, -1) : str;
}
function getPathCharType(ch) {
  if (ch === void 0 || ch === null) {
    return "o";
  }
  const code2 = ch.charCodeAt(0);
  switch (code2) {
    case 91:
    case 93:
    case 46:
    case 34:
    case 39:
      return ch;
    case 95:
    case 36:
    case 45:
      return "i";
    case 9:
    case 10:
    case 13:
    case 160:
    case 65279:
    case 8232:
    case 8233:
      return "w";
  }
  return "i";
}
function formatSubPath(path) {
  const trimmed = path.trim();
  if (path.charAt(0) === "0" && isNaN(parseInt(path))) {
    return false;
  }
  return isLiteral(trimmed) ? stripQuotes(trimmed) : "*" + trimmed;
}
function parse(path) {
  const keys = [];
  let index = -1;
  let mode = 0;
  let subPathDepth = 0;
  let c;
  let key;
  let newChar;
  let type;
  let transition;
  let action;
  let typeMap;
  const actions = [];
  actions[
    0
    /* Actions.APPEND */
  ] = () => {
    if (key === void 0) {
      key = newChar;
    } else {
      key += newChar;
    }
  };
  actions[
    1
    /* Actions.PUSH */
  ] = () => {
    if (key !== void 0) {
      keys.push(key);
      key = void 0;
    }
  };
  actions[
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ] = () => {
    actions[
      0
      /* Actions.APPEND */
    ]();
    subPathDepth++;
  };
  actions[
    3
    /* Actions.PUSH_SUB_PATH */
  ] = () => {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = 4;
      actions[
        0
        /* Actions.APPEND */
      ]();
    } else {
      subPathDepth = 0;
      if (key === void 0) {
        return false;
      }
      key = formatSubPath(key);
      if (key === false) {
        return false;
      } else {
        actions[
          1
          /* Actions.PUSH */
        ]();
      }
    }
  };
  function maybeUnescapeQuote() {
    const nextChar = path[index + 1];
    if (mode === 5 && nextChar === "'" || mode === 6 && nextChar === '"') {
      index++;
      newChar = "\\" + nextChar;
      actions[
        0
        /* Actions.APPEND */
      ]();
      return true;
    }
  }
  while (mode !== null) {
    index++;
    c = path[index];
    if (c === "\\" && maybeUnescapeQuote()) {
      continue;
    }
    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap[
      "l"
      /* PathCharTypes.ELSE */
    ] || 8;
    if (transition === 8) {
      return;
    }
    mode = transition[0];
    if (transition[1] !== void 0) {
      action = actions[transition[1]];
      if (action) {
        newChar = c;
        if (action() === false) {
          return;
        }
      }
    }
    if (mode === 7) {
      return keys;
    }
  }
}
const cache = /* @__PURE__ */ new Map();
function resolveWithKeyValue(obj, path) {
  return isObject$1(obj) ? obj[path] : null;
}
function resolveValue(obj, path) {
  if (!isObject$1(obj)) {
    return null;
  }
  let hit = cache.get(path);
  if (!hit) {
    hit = parse(path);
    if (hit) {
      cache.set(path, hit);
    }
  }
  if (!hit) {
    return null;
  }
  const len = hit.length;
  let last = obj;
  let i = 0;
  while (i < len) {
    const val = last[hit[i]];
    if (val === void 0) {
      return null;
    }
    last = val;
    i++;
  }
  return last;
}
const DEFAULT_MODIFIER = (str) => str;
const DEFAULT_MESSAGE = (ctx) => "";
const DEFAULT_MESSAGE_DATA_TYPE = "text";
const DEFAULT_NORMALIZE = (values) => values.length === 0 ? "" : join(values);
const DEFAULT_INTERPOLATE = toDisplayString;
function pluralDefault(choice, choicesLength) {
  choice = Math.abs(choice);
  if (choicesLength === 2) {
    return choice ? choice > 1 ? 1 : 0 : 1;
  }
  return choice ? Math.min(choice, 2) : 0;
}
function getPluralIndex(options) {
  const index = isNumber(options.pluralIndex) ? options.pluralIndex : -1;
  return options.named && (isNumber(options.named.count) || isNumber(options.named.n)) ? isNumber(options.named.count) ? options.named.count : isNumber(options.named.n) ? options.named.n : index : index;
}
function normalizeNamed(pluralIndex, props) {
  if (!props.count) {
    props.count = pluralIndex;
  }
  if (!props.n) {
    props.n = pluralIndex;
  }
}
function createMessageContext(options = {}) {
  const locale = options.locale;
  const pluralIndex = getPluralIndex(options);
  const pluralRule = isObject$1(options.pluralRules) && isString$1(locale) && isFunction$1(options.pluralRules[locale]) ? options.pluralRules[locale] : pluralDefault;
  const orgPluralRule = isObject$1(options.pluralRules) && isString$1(locale) && isFunction$1(options.pluralRules[locale]) ? pluralDefault : void 0;
  const plural = (messages) => {
    return messages[pluralRule(pluralIndex, messages.length, orgPluralRule)];
  };
  const _list = options.list || [];
  const list = (index) => _list[index];
  const _named = options.named || {};
  isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named);
  const named = (key) => _named[key];
  function message(key) {
    const msg = isFunction$1(options.messages) ? options.messages(key) : isObject$1(options.messages) ? options.messages[key] : false;
    return !msg ? options.parent ? options.parent.message(key) : DEFAULT_MESSAGE : msg;
  }
  const _modifier = (name) => options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER;
  const normalize = isPlainObject(options.processor) && isFunction$1(options.processor.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
  const interpolate = isPlainObject(options.processor) && isFunction$1(options.processor.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
  const type = isPlainObject(options.processor) && isString$1(options.processor.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;
  const linked = (key, ...args) => {
    const [arg1, arg2] = args;
    let type2 = "text";
    let modifier = "";
    if (args.length === 1) {
      if (isObject$1(arg1)) {
        modifier = arg1.modifier || modifier;
        type2 = arg1.type || type2;
      } else if (isString$1(arg1)) {
        modifier = arg1 || modifier;
      }
    } else if (args.length === 2) {
      if (isString$1(arg1)) {
        modifier = arg1 || modifier;
      }
      if (isString$1(arg2)) {
        type2 = arg2 || type2;
      }
    }
    const ret = message(key)(ctx);
    const msg = (
      // The message in vnode resolved with linked are returned as an array by processor.nomalize
      type2 === "vnode" && isArray$1(ret) && modifier ? ret[0] : ret
    );
    return modifier ? _modifier(modifier)(msg, type2) : msg;
  };
  const ctx = {
    [
      "list"
      /* HelperNameMap.LIST */
    ]: list,
    [
      "named"
      /* HelperNameMap.NAMED */
    ]: named,
    [
      "plural"
      /* HelperNameMap.PLURAL */
    ]: plural,
    [
      "linked"
      /* HelperNameMap.LINKED */
    ]: linked,
    [
      "message"
      /* HelperNameMap.MESSAGE */
    ]: message,
    [
      "type"
      /* HelperNameMap.TYPE */
    ]: type,
    [
      "interpolate"
      /* HelperNameMap.INTERPOLATE */
    ]: interpolate,
    [
      "normalize"
      /* HelperNameMap.NORMALIZE */
    ]: normalize,
    [
      "values"
      /* HelperNameMap.VALUES */
    ]: assign$1({}, _list, _named)
  };
  return ctx;
}
let devtools = null;
function setDevToolsHook(hook) {
  devtools = hook;
}
function initI18nDevTools(i18n, version2, meta) {
  devtools && devtools.emit("i18n:init", {
    timestamp: Date.now(),
    i18n,
    version: version2,
    meta
  });
}
const translateDevTools = /* @__PURE__ */ createDevToolsHook(
  "function:translate"
  /* IntlifyDevToolsHooks.FunctionTranslate */
);
function createDevToolsHook(hook) {
  return (payloads) => devtools && devtools.emit(hook, payloads);
}
const CoreWarnCodes = {
  NOT_FOUND_KEY: 1,
  FALLBACK_TO_TRANSLATE: 2,
  CANNOT_FORMAT_NUMBER: 3,
  FALLBACK_TO_NUMBER_FORMAT: 4,
  CANNOT_FORMAT_DATE: 5,
  FALLBACK_TO_DATE_FORMAT: 6,
  EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER: 7,
  __EXTEND_POINT__: 8
};
const warnMessages$1 = {
  [CoreWarnCodes.NOT_FOUND_KEY]: `Not found '{key}' key in '{locale}' locale messages.`,
  [CoreWarnCodes.FALLBACK_TO_TRANSLATE]: `Fall back to translate '{key}' key with '{target}' locale.`,
  [CoreWarnCodes.CANNOT_FORMAT_NUMBER]: `Cannot format a number value due to not supported Intl.NumberFormat.`,
  [CoreWarnCodes.FALLBACK_TO_NUMBER_FORMAT]: `Fall back to number format '{key}' key with '{target}' locale.`,
  [CoreWarnCodes.CANNOT_FORMAT_DATE]: `Cannot format a date value due to not supported Intl.DateTimeFormat.`,
  [CoreWarnCodes.FALLBACK_TO_DATE_FORMAT]: `Fall back to datetime format '{key}' key with '{target}' locale.`,
  [CoreWarnCodes.EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER]: `This project is using Custom Message Compiler, which is an experimental feature. It may receive breaking changes or be removed in the future.`
};
function getWarnMessage$1(code2, ...args) {
  return format$1(warnMessages$1[code2], ...args);
}
function getLocale$1(context, options) {
  return options.locale != null ? resolveLocale(options.locale) : resolveLocale(context.locale);
}
let _resolveLocale;
function resolveLocale(locale) {
  return isString$1(locale) ? locale : _resolveLocale != null && locale.resolvedOnce ? _resolveLocale : _resolveLocale = locale();
}
function fallbackWithSimple(ctx, fallback, start) {
  return [.../* @__PURE__ */ new Set([
    start,
    ...isArray$1(fallback) ? fallback : isObject$1(fallback) ? Object.keys(fallback) : isString$1(fallback) ? [fallback] : [start]
  ])];
}
function fallbackWithLocaleChain(ctx, fallback, start) {
  const startLocale = isString$1(start) ? start : DEFAULT_LOCALE$1;
  const context = ctx;
  if (!context.__localeChainCache) {
    context.__localeChainCache = /* @__PURE__ */ new Map();
  }
  let chain = context.__localeChainCache.get(startLocale);
  if (!chain) {
    chain = [];
    let block = [start];
    while (isArray$1(block)) {
      block = appendBlockToChain(chain, block, fallback);
    }
    const defaults = isArray$1(fallback) || !isPlainObject(fallback) ? fallback : fallback["default"] ? fallback["default"] : null;
    block = isString$1(defaults) ? [defaults] : defaults;
    if (isArray$1(block)) {
      appendBlockToChain(chain, block, false);
    }
    context.__localeChainCache.set(startLocale, chain);
  }
  return chain;
}
function appendBlockToChain(chain, block, blocks) {
  let follow = true;
  for (let i = 0; i < block.length && isBoolean(follow); i++) {
    const locale = block[i];
    if (isString$1(locale)) {
      follow = appendLocaleToChain(chain, block[i], blocks);
    }
  }
  return follow;
}
function appendLocaleToChain(chain, locale, blocks) {
  let follow;
  const tokens = locale.split("-");
  do {
    const target = tokens.join("-");
    follow = appendItemToChain(chain, target, blocks);
    tokens.splice(-1, 1);
  } while (tokens.length && follow === true);
  return follow;
}
function appendItemToChain(chain, target, blocks) {
  let follow = false;
  if (!chain.includes(target)) {
    follow = true;
    if (target) {
      follow = target[target.length - 1] !== "!";
      const locale = target.replace(/!/g, "");
      chain.push(locale);
      if ((isArray$1(blocks) || isPlainObject(blocks)) && blocks[locale]) {
        follow = blocks[locale];
      }
    }
  }
  return follow;
}
const VERSION$1 = "9.5.0";
const NOT_REOSLVED = -1;
const DEFAULT_LOCALE$1 = "en-US";
const MISSING_RESOLVE_VALUE = "";
const capitalize = (str) => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`;
function getDefaultLinkedModifiers() {
  return {
    upper: (val, type) => {
      return type === "text" && isString$1(val) ? val.toUpperCase() : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? val.children.toUpperCase() : val;
    },
    lower: (val, type) => {
      return type === "text" && isString$1(val) ? val.toLowerCase() : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? val.children.toLowerCase() : val;
    },
    capitalize: (val, type) => {
      return type === "text" && isString$1(val) ? capitalize(val) : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? capitalize(val.children) : val;
    }
  };
}
let _compiler;
function registerMessageCompiler(compiler) {
  _compiler = compiler;
}
let _resolver;
function registerMessageResolver(resolver) {
  _resolver = resolver;
}
let _fallbacker;
function registerLocaleFallbacker(fallbacker) {
  _fallbacker = fallbacker;
}
let _additionalMeta = null;
const setAdditionalMeta = (meta) => {
  _additionalMeta = meta;
};
const getAdditionalMeta = () => _additionalMeta;
let _fallbackContext = null;
const setFallbackContext = (context) => {
  _fallbackContext = context;
};
const getFallbackContext = () => _fallbackContext;
let _cid = 0;
function createCoreContext(options = {}) {
  const onWarn = isFunction$1(options.onWarn) ? options.onWarn : warn$1;
  const version2 = isString$1(options.version) ? options.version : VERSION$1;
  const locale = isString$1(options.locale) || isFunction$1(options.locale) ? options.locale : DEFAULT_LOCALE$1;
  const _locale = isFunction$1(locale) ? DEFAULT_LOCALE$1 : locale;
  const fallbackLocale = isArray$1(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || isString$1(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale;
  const messages = isPlainObject(options.messages) ? options.messages : { [_locale]: {} };
  const datetimeFormats = isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale]: {} };
  const numberFormats = isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale]: {} };
  const modifiers = assign$1({}, options.modifiers || {}, getDefaultLinkedModifiers());
  const pluralRules = options.pluralRules || {};
  const missing = isFunction$1(options.missing) ? options.missing : null;
  const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const fallbackFormat = !!options.fallbackFormat;
  const unresolving = !!options.unresolving;
  const postTranslation = isFunction$1(options.postTranslation) ? options.postTranslation : null;
  const processor = isPlainObject(options.processor) ? options.processor : null;
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const escapeParameter = !!options.escapeParameter;
  const messageCompiler = isFunction$1(options.messageCompiler) ? options.messageCompiler : _compiler;
  if (process.env.NODE_ENV !== "production" && true && true && isFunction$1(options.messageCompiler)) {
    warnOnce(getWarnMessage$1(CoreWarnCodes.EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER));
  }
  const messageResolver = isFunction$1(options.messageResolver) ? options.messageResolver : _resolver || resolveWithKeyValue;
  const localeFallbacker = isFunction$1(options.localeFallbacker) ? options.localeFallbacker : _fallbacker || fallbackWithSimple;
  const fallbackContext = isObject$1(options.fallbackContext) ? options.fallbackContext : void 0;
  const internalOptions = options;
  const __datetimeFormatters = isObject$1(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : /* @__PURE__ */ new Map();
  const __numberFormatters = isObject$1(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : /* @__PURE__ */ new Map();
  const __meta = isObject$1(internalOptions.__meta) ? internalOptions.__meta : {};
  _cid++;
  const context = {
    version: version2,
    cid: _cid,
    locale,
    fallbackLocale,
    messages,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation,
    processor,
    warnHtmlMessage,
    escapeParameter,
    messageCompiler,
    messageResolver,
    localeFallbacker,
    fallbackContext,
    onWarn,
    __meta
  };
  {
    context.datetimeFormats = datetimeFormats;
    context.numberFormats = numberFormats;
    context.__datetimeFormatters = __datetimeFormatters;
    context.__numberFormatters = __numberFormatters;
  }
  if (process.env.NODE_ENV !== "production") {
    context.__v_emitter = internalOptions.__v_emitter != null ? internalOptions.__v_emitter : void 0;
  }
  if (process.env.NODE_ENV !== "production" || __INTLIFY_PROD_DEVTOOLS__) {
    initI18nDevTools(context, version2, __meta);
  }
  return context;
}
function isTranslateFallbackWarn(fallback, key) {
  return fallback instanceof RegExp ? fallback.test(key) : fallback;
}
function isTranslateMissingWarn(missing, key) {
  return missing instanceof RegExp ? missing.test(key) : missing;
}
function handleMissing(context, key, locale, missingWarn, type) {
  const { missing, onWarn } = context;
  if (process.env.NODE_ENV !== "production") {
    const emitter = context.__v_emitter;
    if (emitter) {
      emitter.emit("missing", {
        locale,
        key,
        type,
        groupId: `${type}:${key}`
      });
    }
  }
  if (missing !== null) {
    const ret = missing(context, locale, key, type);
    return isString$1(ret) ? ret : key;
  } else {
    if (process.env.NODE_ENV !== "production" && isTranslateMissingWarn(missingWarn, key)) {
      onWarn(getWarnMessage$1(CoreWarnCodes.NOT_FOUND_KEY, { key, locale }));
    }
    return key;
  }
}
function updateFallbackLocale(ctx, locale, fallback) {
  const context = ctx;
  context.__localeChainCache = /* @__PURE__ */ new Map();
  ctx.localeFallbacker(ctx, fallback, locale);
}
function format(ast) {
  const msg = (ctx) => formatParts(ctx, ast);
  return msg;
}
function formatParts(ctx, ast) {
  const body = ast.b || ast.body;
  if ((body.t || body.type) === 1) {
    const plural = body;
    const cases = plural.c || plural.cases;
    return ctx.plural(cases.reduce((messages, c) => [
      ...messages,
      formatMessageParts(ctx, c)
    ], []));
  } else {
    return formatMessageParts(ctx, body);
  }
}
function formatMessageParts(ctx, node) {
  const _static = node.s || node.static;
  if (_static) {
    return ctx.type === "text" ? _static : ctx.normalize([_static]);
  } else {
    const messages = (node.i || node.items).reduce((acm, c) => [...acm, formatMessagePart(ctx, c)], []);
    return ctx.normalize(messages);
  }
}
function formatMessagePart(ctx, node) {
  const type = node.t || node.type;
  switch (type) {
    case 3:
      const text = node;
      return text.v || text.value;
    case 9:
      const literal = node;
      return literal.v || literal.value;
    case 4:
      const named = node;
      return ctx.interpolate(ctx.named(named.k || named.key));
    case 5:
      const list = node;
      return ctx.interpolate(ctx.list(list.i != null ? list.i : list.index));
    case 6:
      const linked = node;
      const modifier = linked.m || linked.modifier;
      return ctx.linked(formatMessagePart(ctx, linked.k || linked.key), modifier ? formatMessagePart(ctx, modifier) : void 0, ctx.type);
    case 7:
      const linkedKey = node;
      return linkedKey.v || linkedKey.value;
    case 8:
      const linkedModifier = node;
      return linkedModifier.v || linkedModifier.value;
    default:
      throw new Error(`unhandled node type on format message part: ${type}`);
  }
}
const code$2 = CompileErrorCodes.__EXTEND_POINT__;
const inc$2 = incrementer(code$2);
const CoreErrorCodes = {
  INVALID_ARGUMENT: code$2,
  INVALID_DATE_ARGUMENT: inc$2(),
  INVALID_ISO_DATE_ARGUMENT: inc$2(),
  NOT_SUPPORT_NON_STRING_MESSAGE: inc$2(),
  __EXTEND_POINT__: inc$2()
  // 22
};
function createCoreError(code2) {
  return createCompileError(code2, null, process.env.NODE_ENV !== "production" ? { messages: errorMessages$1 } : void 0);
}
const errorMessages$1 = {
  [CoreErrorCodes.INVALID_ARGUMENT]: "Invalid arguments",
  [CoreErrorCodes.INVALID_DATE_ARGUMENT]: "The date provided is an invalid Date object.Make sure your Date represents a valid date.",
  [CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT]: "The argument provided is not a valid ISO date string",
  [CoreErrorCodes.NOT_SUPPORT_NON_STRING_MESSAGE]: "Not support non-string message"
};
const WARN_MESSAGE = `Detected HTML in '{source}' message. Recommend not using HTML messages to avoid XSS.`;
function checkHtmlMessage(source, warnHtmlMessage) {
  if (warnHtmlMessage && detectHtmlTag(source)) {
    warn$1(format$1(WARN_MESSAGE, { source }));
  }
}
const defaultOnCacheKey = (message) => message;
let compileCache = /* @__PURE__ */ Object.create(null);
const isMessageAST = (val) => isObject$1(val) && (val.t === 0 || val.type === 0) && ("b" in val || "body" in val);
function baseCompile(message, options = {}) {
  let detectError = false;
  const onError = options.onError || defaultOnError;
  options.onError = (err) => {
    detectError = true;
    onError(err);
  };
  return { ...baseCompile$1(message, options), detectError };
}
function compile(message, context) {
  if (isString$1(message)) {
    const warnHtmlMessage = isBoolean(context.warnHtmlMessage) ? context.warnHtmlMessage : true;
    process.env.NODE_ENV !== "production" && checkHtmlMessage(message, warnHtmlMessage);
    const onCacheKey = context.onCacheKey || defaultOnCacheKey;
    const cacheKey = onCacheKey(message);
    const cached = compileCache[cacheKey];
    if (cached) {
      return cached;
    }
    const { ast, detectError } = baseCompile(message, {
      ...context,
      location: process.env.NODE_ENV !== "production",
      jit: true
    });
    const msg = format(ast);
    return !detectError ? compileCache[cacheKey] = msg : msg;
  } else {
    if (process.env.NODE_ENV !== "production" && !isMessageAST(message)) {
      warn$1(`the message that is resolve with key '${context.key}' is not supported for jit compilation`);
      return () => message;
    }
    const cacheKey = message.cacheKey;
    if (cacheKey) {
      const cached = compileCache[cacheKey];
      if (cached) {
        return cached;
      }
      return compileCache[cacheKey] = format(message);
    } else {
      return format(message);
    }
  }
}
const NOOP_MESSAGE_FUNCTION = () => "";
const isMessageFunction = (val) => isFunction$1(val);
function translate(context, ...args) {
  const { fallbackFormat, postTranslation, unresolving, messageCompiler, fallbackLocale, messages } = context;
  const [key, options] = parseTranslateArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const escapeParameter = isBoolean(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
  const resolvedMessage = !!options.resolvedMessage;
  const defaultMsgOrKey = isString$1(options.default) || isBoolean(options.default) ? !isBoolean(options.default) ? options.default : !messageCompiler ? () => key : key : fallbackFormat ? !messageCompiler ? () => key : key : "";
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey !== "";
  const locale = getLocale$1(context, options);
  escapeParameter && escapeParams(options);
  let [formatScope, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [
    key,
    locale,
    messages[locale] || {}
  ];
  let format2 = formatScope;
  let cacheBaseKey = key;
  if (!resolvedMessage && !(isString$1(format2) || isMessageAST(format2) || isMessageFunction(format2))) {
    if (enableDefaultMsg) {
      format2 = defaultMsgOrKey;
      cacheBaseKey = format2;
    }
  }
  if (!resolvedMessage && (!(isString$1(format2) || isMessageAST(format2) || isMessageFunction(format2)) || !isString$1(targetLocale))) {
    return unresolving ? NOT_REOSLVED : key;
  }
  if (process.env.NODE_ENV !== "production" && isString$1(format2) && context.messageCompiler == null) {
    warn$1(`The message format compilation is not supported in this build. Because message compiler isn't included. You need to pre-compilation all message format. So translate function return '${key}'.`);
    return key;
  }
  let occurred = false;
  const onError = () => {
    occurred = true;
  };
  const msg = !isMessageFunction(format2) ? compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) : format2;
  if (occurred) {
    return format2;
  }
  const ctxOptions = getMessageContextOptions(context, targetLocale, message, options);
  const msgContext = createMessageContext(ctxOptions);
  const messaged = evaluateMessage(context, msg, msgContext);
  const ret = postTranslation ? postTranslation(messaged, key) : messaged;
  if (process.env.NODE_ENV !== "production" || __INTLIFY_PROD_DEVTOOLS__) {
    const payloads = {
      timestamp: Date.now(),
      key: isString$1(key) ? key : isMessageFunction(format2) ? format2.key : "",
      locale: targetLocale || (isMessageFunction(format2) ? format2.locale : ""),
      format: isString$1(format2) ? format2 : isMessageFunction(format2) ? format2.source : "",
      message: ret
    };
    payloads.meta = assign$1({}, context.__meta, getAdditionalMeta() || {});
    translateDevTools(payloads);
  }
  return ret;
}
function escapeParams(options) {
  if (isArray$1(options.list)) {
    options.list = options.list.map((item) => isString$1(item) ? escapeHtml(item) : item);
  } else if (isObject$1(options.named)) {
    Object.keys(options.named).forEach((key) => {
      if (isString$1(options.named[key])) {
        options.named[key] = escapeHtml(options.named[key]);
      }
    });
  }
}
function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
  const { messages, onWarn, messageResolver: resolveValue2, localeFallbacker } = context;
  const locales = localeFallbacker(context, fallbackLocale, locale);
  let message = {};
  let targetLocale;
  let format2 = null;
  let from = locale;
  let to = null;
  const type = "translate";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = to = locales[i];
    if (process.env.NODE_ENV !== "production" && locale !== targetLocale && isTranslateFallbackWarn(fallbackWarn, key)) {
      onWarn(getWarnMessage$1(CoreWarnCodes.FALLBACK_TO_TRANSLATE, {
        key,
        target: targetLocale
      }));
    }
    if (process.env.NODE_ENV !== "production" && locale !== targetLocale) {
      const emitter = context.__v_emitter;
      if (emitter) {
        emitter.emit("fallback", {
          type,
          key,
          from,
          to,
          groupId: `${type}:${key}`
        });
      }
    }
    message = messages[targetLocale] || {};
    let start = null;
    let startTag;
    let endTag;
    if (process.env.NODE_ENV !== "production" && inBrowser) {
      start = window.performance.now();
      startTag = "intlify-message-resolve-start";
      endTag = "intlify-message-resolve-end";
    }
    if ((format2 = resolveValue2(message, key)) === null) {
      format2 = message[key];
    }
    if (process.env.NODE_ENV !== "production" && inBrowser) {
      const end = window.performance.now();
      const emitter = context.__v_emitter;
      if (emitter && start && format2) {
        emitter.emit("message-resolve", {
          type: "message-resolve",
          key,
          message: format2,
          time: end - start,
          groupId: `${type}:${key}`
        });
      }
      if (startTag && endTag && mark && measure) {
        mark(endTag);
        measure("intlify message resolve", startTag, endTag);
      }
    }
    if (isString$1(format2) || isMessageAST(format2) || isMessageFunction(format2)) {
      break;
    }
    const missingRet = handleMissing(
      context,
      // eslint-disable-line @typescript-eslint/no-explicit-any
      key,
      targetLocale,
      missingWarn,
      type
    );
    if (missingRet !== key) {
      format2 = missingRet;
    }
    from = to;
  }
  return [format2, targetLocale, message];
}
function compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) {
  const { messageCompiler, warnHtmlMessage } = context;
  if (isMessageFunction(format2)) {
    const msg2 = format2;
    msg2.locale = msg2.locale || targetLocale;
    msg2.key = msg2.key || key;
    return msg2;
  }
  if (messageCompiler == null) {
    const msg2 = () => format2;
    msg2.locale = targetLocale;
    msg2.key = key;
    return msg2;
  }
  let start = null;
  let startTag;
  let endTag;
  if (process.env.NODE_ENV !== "production" && inBrowser) {
    start = window.performance.now();
    startTag = "intlify-message-compilation-start";
    endTag = "intlify-message-compilation-end";
  }
  const msg = messageCompiler(format2, getCompileContext(context, targetLocale, cacheBaseKey, format2, warnHtmlMessage, onError));
  if (process.env.NODE_ENV !== "production" && inBrowser) {
    const end = window.performance.now();
    const emitter = context.__v_emitter;
    if (emitter && start) {
      emitter.emit("message-compilation", {
        type: "message-compilation",
        message: format2,
        time: end - start,
        groupId: `${"translate"}:${key}`
      });
    }
    if (startTag && endTag && mark && measure) {
      mark(endTag);
      measure("intlify message compilation", startTag, endTag);
    }
  }
  msg.locale = targetLocale;
  msg.key = key;
  msg.source = format2;
  return msg;
}
function evaluateMessage(context, msg, msgCtx) {
  let start = null;
  let startTag;
  let endTag;
  if (process.env.NODE_ENV !== "production" && inBrowser) {
    start = window.performance.now();
    startTag = "intlify-message-evaluation-start";
    endTag = "intlify-message-evaluation-end";
  }
  const messaged = msg(msgCtx);
  if (process.env.NODE_ENV !== "production" && inBrowser) {
    const end = window.performance.now();
    const emitter = context.__v_emitter;
    if (emitter && start) {
      emitter.emit("message-evaluation", {
        type: "message-evaluation",
        value: messaged,
        time: end - start,
        groupId: `${"translate"}:${msg.key}`
      });
    }
    if (startTag && endTag && mark && measure) {
      mark(endTag);
      measure("intlify message evaluation", startTag, endTag);
    }
  }
  return messaged;
}
function parseTranslateArgs(...args) {
  const [arg1, arg2, arg3] = args;
  const options = {};
  if (!isString$1(arg1) && !isNumber(arg1) && !isMessageFunction(arg1) && !isMessageAST(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const key = isNumber(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;
  if (isNumber(arg2)) {
    options.plural = arg2;
  } else if (isString$1(arg2)) {
    options.default = arg2;
  } else if (isPlainObject(arg2) && !isEmptyObject(arg2)) {
    options.named = arg2;
  } else if (isArray$1(arg2)) {
    options.list = arg2;
  }
  if (isNumber(arg3)) {
    options.plural = arg3;
  } else if (isString$1(arg3)) {
    options.default = arg3;
  } else if (isPlainObject(arg3)) {
    assign$1(options, arg3);
  }
  return [key, options];
}
function getCompileContext(context, locale, key, source, warnHtmlMessage, onError) {
  return {
    locale,
    key,
    warnHtmlMessage,
    onError: (err) => {
      onError && onError(err);
      if (process.env.NODE_ENV !== "production") {
        const _source = getSourceForCodeFrame(source);
        const message = `Message compilation error: ${err.message}`;
        const codeFrame = err.location && _source && generateCodeFrame(_source, err.location.start.offset, err.location.end.offset);
        const emitter = context.__v_emitter;
        if (emitter && _source) {
          emitter.emit("compile-error", {
            message: _source,
            error: err.message,
            start: err.location && err.location.start.offset,
            end: err.location && err.location.end.offset,
            groupId: `${"translate"}:${key}`
          });
        }
        console.error(codeFrame ? `${message}
${codeFrame}` : message);
      } else {
        throw err;
      }
    },
    onCacheKey: (source2) => generateFormatCacheKey(locale, key, source2)
  };
}
function getSourceForCodeFrame(source) {
  var _a;
  if (isString$1(source))
    ;
  else {
    if ((_a = source.loc) == null ? void 0 : _a.source) {
      return source.loc.source;
    }
  }
}
function getMessageContextOptions(context, locale, message, options) {
  const { modifiers, pluralRules, messageResolver: resolveValue2, fallbackLocale, fallbackWarn, missingWarn, fallbackContext } = context;
  const resolveMessage = (key) => {
    let val = resolveValue2(message, key);
    if (val == null && fallbackContext) {
      const [, , message2] = resolveMessageFormat(fallbackContext, key, locale, fallbackLocale, fallbackWarn, missingWarn);
      val = resolveValue2(message2, key);
    }
    if (isString$1(val) || isMessageAST(val)) {
      let occurred = false;
      const onError = () => {
        occurred = true;
      };
      const msg = compileMessageFormat(context, key, locale, val, key, onError);
      return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
    } else if (isMessageFunction(val)) {
      return val;
    } else {
      return NOOP_MESSAGE_FUNCTION;
    }
  };
  const ctxOptions = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  };
  if (context.processor) {
    ctxOptions.processor = context.processor;
  }
  if (options.list) {
    ctxOptions.list = options.list;
  }
  if (options.named) {
    ctxOptions.named = options.named;
  }
  if (isNumber(options.plural)) {
    ctxOptions.pluralIndex = options.plural;
  }
  return ctxOptions;
}
const intlDefined = typeof Intl !== "undefined";
const Availabilities = {
  dateTimeFormat: intlDefined && typeof Intl.DateTimeFormat !== "undefined",
  numberFormat: intlDefined && typeof Intl.NumberFormat !== "undefined"
};
function datetime(context, ...args) {
  const { datetimeFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __datetimeFormatters } = context;
  if (process.env.NODE_ENV !== "production" && !Availabilities.dateTimeFormat) {
    onWarn(getWarnMessage$1(CoreWarnCodes.CANNOT_FORMAT_DATE));
    return MISSING_RESOLVE_VALUE;
  }
  const [key, value, options, overrides] = parseDateTimeArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale$1(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString$1(key) || key === "") {
    return new Intl.DateTimeFormat(locale, overrides).format(value);
  }
  let datetimeFormat = {};
  let targetLocale;
  let format2 = null;
  let from = locale;
  let to = null;
  const type = "datetime format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = to = locales[i];
    if (process.env.NODE_ENV !== "production" && locale !== targetLocale && isTranslateFallbackWarn(fallbackWarn, key)) {
      onWarn(getWarnMessage$1(CoreWarnCodes.FALLBACK_TO_DATE_FORMAT, {
        key,
        target: targetLocale
      }));
    }
    if (process.env.NODE_ENV !== "production" && locale !== targetLocale) {
      const emitter = context.__v_emitter;
      if (emitter) {
        emitter.emit("fallback", {
          type,
          key,
          from,
          to,
          groupId: `${type}:${key}`
        });
      }
    }
    datetimeFormat = datetimeFormats[targetLocale] || {};
    format2 = datetimeFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
    from = to;
  }
  if (!isPlainObject(format2) || !isString$1(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __datetimeFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(targetLocale, assign$1({}, format2, overrides));
    __datetimeFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const DATETIME_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName",
  "formatMatcher",
  "hour12",
  "timeZone",
  "dateStyle",
  "timeStyle",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "hourCycle",
  "fractionalSecondDigits"
];
function parseDateTimeArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = {};
  let overrides = {};
  let value;
  if (isString$1(arg1)) {
    const matches = arg1.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
    if (!matches) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
    const dateTime = matches[3] ? matches[3].trim().startsWith("T") ? `${matches[1].trim()}${matches[3].trim()}` : `${matches[1].trim()}T${matches[3].trim()}` : matches[1].trim();
    value = new Date(dateTime);
    try {
      value.toISOString();
    } catch (e) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (isDate(arg1)) {
    if (isNaN(arg1.getTime())) {
      throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT);
    }
    value = arg1;
  } else if (isNumber(arg1)) {
    value = arg1;
  } else {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  if (isString$1(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (DATETIME_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString$1(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearDateTimeFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__datetimeFormatters.has(id)) {
      continue;
    }
    context.__datetimeFormatters.delete(id);
  }
}
function number(context, ...args) {
  const { numberFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __numberFormatters } = context;
  if (process.env.NODE_ENV !== "production" && !Availabilities.numberFormat) {
    onWarn(getWarnMessage$1(CoreWarnCodes.CANNOT_FORMAT_NUMBER));
    return MISSING_RESOLVE_VALUE;
  }
  const [key, value, options, overrides] = parseNumberArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale$1(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString$1(key) || key === "") {
    return new Intl.NumberFormat(locale, overrides).format(value);
  }
  let numberFormat = {};
  let targetLocale;
  let format2 = null;
  let from = locale;
  let to = null;
  const type = "number format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = to = locales[i];
    if (process.env.NODE_ENV !== "production" && locale !== targetLocale && isTranslateFallbackWarn(fallbackWarn, key)) {
      onWarn(getWarnMessage$1(CoreWarnCodes.FALLBACK_TO_NUMBER_FORMAT, {
        key,
        target: targetLocale
      }));
    }
    if (process.env.NODE_ENV !== "production" && locale !== targetLocale) {
      const emitter = context.__v_emitter;
      if (emitter) {
        emitter.emit("fallback", {
          type,
          key,
          from,
          to,
          groupId: `${type}:${key}`
        });
      }
    }
    numberFormat = numberFormats[targetLocale] || {};
    format2 = numberFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
    from = to;
  }
  if (!isPlainObject(format2) || !isString$1(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __numberFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.NumberFormat(targetLocale, assign$1({}, format2, overrides));
    __numberFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const NUMBER_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "style",
  "currency",
  "currencyDisplay",
  "currencySign",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "compactDisplay",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "roundingMode",
  "roundingPriority",
  "roundingIncrement",
  "trailingZeroDisplay"
];
function parseNumberArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = {};
  let overrides = {};
  if (!isNumber(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const value = arg1;
  if (isString$1(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (NUMBER_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString$1(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearNumberFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__numberFormatters.has(id)) {
      continue;
    }
    context.__numberFormatters.delete(id);
  }
}
{
  initFeatureFlags$1();
}
/*!
  * vue-i18n v9.5.0
  * (c) 2023 kazuya kawaguchi
  * Released under the MIT License.
  */
const VERSION = "9.5.0";
function initFeatureFlags() {
  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }
}
const code$1 = CoreWarnCodes.__EXTEND_POINT__;
const inc$1 = incrementer(code$1);
const I18nWarnCodes = {
  FALLBACK_TO_ROOT: code$1,
  NOT_SUPPORTED_PRESERVE: inc$1(),
  NOT_SUPPORTED_FORMATTER: inc$1(),
  NOT_SUPPORTED_PRESERVE_DIRECTIVE: inc$1(),
  NOT_SUPPORTED_GET_CHOICE_INDEX: inc$1(),
  COMPONENT_NAME_LEGACY_COMPATIBLE: inc$1(),
  NOT_FOUND_PARENT_SCOPE: inc$1(),
  IGNORE_OBJ_FLATTEN: inc$1(),
  NOTICE_DROP_ALLOW_COMPOSITION: inc$1()
  // 17
};
const warnMessages = {
  [I18nWarnCodes.FALLBACK_TO_ROOT]: `Fall back to {type} '{key}' with root locale.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE]: `Not supported 'preserve'.`,
  [I18nWarnCodes.NOT_SUPPORTED_FORMATTER]: `Not supported 'formatter'.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE]: `Not supported 'preserveDirectiveContent'.`,
  [I18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX]: `Not supported 'getChoiceIndex'.`,
  [I18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE]: `Component name legacy compatible: '{name}' -> 'i18n'`,
  [I18nWarnCodes.NOT_FOUND_PARENT_SCOPE]: `Not found parent scope. use the global scope.`,
  [I18nWarnCodes.IGNORE_OBJ_FLATTEN]: `Ignore object flatten: '{key}' key has an string value`,
  [I18nWarnCodes.NOTICE_DROP_ALLOW_COMPOSITION]: `'allowComposition' option will be dropped in the next major version. For more information, please see 👉 https://tinyurl.com/2p97mcze`
};
function getWarnMessage(code2, ...args) {
  return format$1(warnMessages[code2], ...args);
}
const code = CoreErrorCodes.__EXTEND_POINT__;
const inc = incrementer(code);
const I18nErrorCodes = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: code,
  // legacy module errors
  INVALID_ARGUMENT: inc(),
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: inc(),
  NOT_INSTALLED: inc(),
  NOT_AVAILABLE_IN_LEGACY_MODE: inc(),
  // directive module errors
  REQUIRED_VALUE: inc(),
  INVALID_VALUE: inc(),
  // vue-devtools errors
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: inc(),
  NOT_INSTALLED_WITH_PROVIDE: inc(),
  // unexpected error
  UNEXPECTED_ERROR: inc(),
  // not compatible legacy vue-i18n constructor
  NOT_COMPATIBLE_LEGACY_VUE_I18N: inc(),
  // bridge support vue 2.x only
  BRIDGE_SUPPORT_VUE_2_ONLY: inc(),
  // need to define `i18n` option in `allowComposition: true` and `useScope: 'local' at `useI18n``
  MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION: inc(),
  // Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly
  NOT_AVAILABLE_COMPOSITION_IN_LEGACY: inc(),
  // for enhancement
  __EXTEND_POINT__: inc()
  // 37
};
function createI18nError(code2, ...args) {
  return createCompileError(code2, null, process.env.NODE_ENV !== "production" ? { messages: errorMessages, args } : void 0);
}
const errorMessages = {
  [I18nErrorCodes.UNEXPECTED_RETURN_TYPE]: "Unexpected return type in composer",
  [I18nErrorCodes.INVALID_ARGUMENT]: "Invalid argument",
  [I18nErrorCodes.MUST_BE_CALL_SETUP_TOP]: "Must be called at the top of a `setup` function",
  [I18nErrorCodes.NOT_INSTALLED]: "Need to install with `app.use` function",
  [I18nErrorCodes.UNEXPECTED_ERROR]: "Unexpected error",
  [I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE]: "Not available in legacy mode",
  [I18nErrorCodes.REQUIRED_VALUE]: `Required in value: {0}`,
  [I18nErrorCodes.INVALID_VALUE]: `Invalid value`,
  [I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN]: `Cannot setup vue-devtools plugin`,
  [I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE]: "Need to install with `provide` function",
  [I18nErrorCodes.NOT_COMPATIBLE_LEGACY_VUE_I18N]: "Not compatible legacy VueI18n.",
  [I18nErrorCodes.BRIDGE_SUPPORT_VUE_2_ONLY]: "vue-i18n-bridge support Vue 2.x only",
  [I18nErrorCodes.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION]: "Must define ‘i18n’ option or custom block in Composition API with using local scope in Legacy API mode",
  [I18nErrorCodes.NOT_AVAILABLE_COMPOSITION_IN_LEGACY]: "Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly"
};
const TranslateVNodeSymbol = /* @__PURE__ */ makeSymbol$1("__translateVNode");
const DatetimePartsSymbol = /* @__PURE__ */ makeSymbol$1("__datetimeParts");
const NumberPartsSymbol = /* @__PURE__ */ makeSymbol$1("__numberParts");
const EnableEmitter = /* @__PURE__ */ makeSymbol$1("__enableEmitter");
const DisableEmitter = /* @__PURE__ */ makeSymbol$1("__disableEmitter");
const SetPluralRulesSymbol = makeSymbol$1("__setPluralRules");
const InejctWithOptionSymbol = /* @__PURE__ */ makeSymbol$1("__injectWithOption");
const DisposeSymbol = /* @__PURE__ */ makeSymbol$1("__dispose");
function handleFlatJson(obj) {
  if (!isObject$1(obj)) {
    return obj;
  }
  for (const key in obj) {
    if (!hasOwn(obj, key)) {
      continue;
    }
    if (!key.includes(".")) {
      if (isObject$1(obj[key])) {
        handleFlatJson(obj[key]);
      }
    } else {
      const subKeys = key.split(".");
      const lastIndex = subKeys.length - 1;
      let currentObj = obj;
      let hasStringValue = false;
      for (let i = 0; i < lastIndex; i++) {
        if (!(subKeys[i] in currentObj)) {
          currentObj[subKeys[i]] = {};
        }
        if (!isObject$1(currentObj[subKeys[i]])) {
          process.env.NODE_ENV !== "production" && warn$1(getWarnMessage(I18nWarnCodes.IGNORE_OBJ_FLATTEN, {
            key: subKeys[i]
          }));
          hasStringValue = true;
          break;
        }
        currentObj = currentObj[subKeys[i]];
      }
      if (!hasStringValue) {
        currentObj[subKeys[lastIndex]] = obj[key];
        delete obj[key];
      }
      if (isObject$1(currentObj[subKeys[lastIndex]])) {
        handleFlatJson(currentObj[subKeys[lastIndex]]);
      }
    }
  }
  return obj;
}
function getLocaleMessages(locale, options) {
  const { messages, __i18n, messageResolver, flatJson } = options;
  const ret = isPlainObject(messages) ? messages : isArray$1(__i18n) ? {} : { [locale]: {} };
  if (isArray$1(__i18n)) {
    __i18n.forEach((custom) => {
      if ("locale" in custom && "resource" in custom) {
        const { locale: locale2, resource } = custom;
        if (locale2) {
          ret[locale2] = ret[locale2] || {};
          deepCopy$1(resource, ret[locale2]);
        } else {
          deepCopy$1(resource, ret);
        }
      } else {
        isString$1(custom) && deepCopy$1(JSON.parse(custom), ret);
      }
    });
  }
  if (messageResolver == null && flatJson) {
    for (const key in ret) {
      if (hasOwn(ret, key)) {
        handleFlatJson(ret[key]);
      }
    }
  }
  return ret;
}
const isNotObjectOrIsArray = (val) => !isObject$1(val) || isArray$1(val);
function deepCopy$1(src, des) {
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
  for (const key in src) {
    if (hasOwn(src, key)) {
      if (isNotObjectOrIsArray(src[key]) || isNotObjectOrIsArray(des[key])) {
        des[key] = src[key];
      } else {
        deepCopy$1(src[key], des[key]);
      }
    }
  }
}
function getComponentOptions(instance) {
  return instance.type;
}
function adjustI18nResources(gl, options, componentOptions) {
  let messages = isObject$1(options.messages) ? options.messages : {};
  if ("__i18nGlobal" in componentOptions) {
    messages = getLocaleMessages(gl.locale.value, {
      messages,
      __i18n: componentOptions.__i18nGlobal
    });
  }
  const locales = Object.keys(messages);
  if (locales.length) {
    locales.forEach((locale) => {
      gl.mergeLocaleMessage(locale, messages[locale]);
    });
  }
  {
    if (isObject$1(options.datetimeFormats)) {
      const locales2 = Object.keys(options.datetimeFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
        });
      }
    }
    if (isObject$1(options.numberFormats)) {
      const locales2 = Object.keys(options.numberFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeNumberFormat(locale, options.numberFormats[locale]);
        });
      }
    }
  }
}
function createTextNode(key) {
  return createVNode(Text, null, key, 0);
}
const DEVTOOLS_META = "__INTLIFY_META__";
let composerID = 0;
function defineCoreMissingHandler(missing) {
  return (ctx, locale, key, type) => {
    return missing(locale, key, getCurrentInstance() || void 0, type);
  };
}
const getMetaInfo = () => {
  const instance = getCurrentInstance();
  let meta = null;
  return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META]) ? { [DEVTOOLS_META]: meta } : null;
};
function createComposer(options = {}, VueI18nLegacy) {
  const { __root, __injectWithOption } = options;
  const _isGlobal = __root === void 0;
  let _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;
  const _locale = ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.locale.value : isString$1(options.locale) ? options.locale : DEFAULT_LOCALE$1
  );
  const _fallbackLocale = ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.fallbackLocale.value : isString$1(options.fallbackLocale) || isArray$1(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value
  );
  const _messages = ref(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = ref(isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  let _missingWarn = __root ? __root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  let _fallbackWarn = __root ? __root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  let _fallbackRoot = __root ? __root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  let _fallbackFormat = !!options.fallbackFormat;
  let _missing = isFunction$1(options.missing) ? options.missing : null;
  let _runtimeMissing = isFunction$1(options.missing) ? defineCoreMissingHandler(options.missing) : null;
  let _postTranslation = isFunction$1(options.postTranslation) ? options.postTranslation : null;
  let _warnHtmlMessage = __root ? __root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  let _escapeParameter = !!options.escapeParameter;
  const _modifiers = __root ? __root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {};
  let _pluralRules = options.pluralRules || __root && __root.pluralRules;
  let _context;
  const getCoreContext = () => {
    _isGlobal && setFallbackContext(null);
    const ctxOptions = {
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? void 0 : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? void 0 : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      messageResolver: options.messageResolver,
      messageCompiler: options.messageCompiler,
      __meta: { framework: "vue" }
    };
    {
      ctxOptions.datetimeFormats = _datetimeFormats.value;
      ctxOptions.numberFormats = _numberFormats.value;
      ctxOptions.__datetimeFormatters = isPlainObject(_context) ? _context.__datetimeFormatters : void 0;
      ctxOptions.__numberFormatters = isPlainObject(_context) ? _context.__numberFormatters : void 0;
    }
    if (process.env.NODE_ENV !== "production") {
      ctxOptions.__v_emitter = isPlainObject(_context) ? _context.__v_emitter : void 0;
    }
    const ctx = createCoreContext(ctxOptions);
    _isGlobal && setFallbackContext(ctx);
    return ctx;
  };
  _context = getCoreContext();
  updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed({
    get: () => _locale.value,
    set: (val) => {
      _locale.value = val;
      _context.locale = _locale.value;
    }
  });
  const fallbackLocale = computed({
    get: () => _fallbackLocale.value,
    set: (val) => {
      _fallbackLocale.value = val;
      _context.fallbackLocale = _fallbackLocale.value;
      updateFallbackLocale(_context, _locale.value, val);
    }
  });
  const messages = computed(() => _messages.value);
  const datetimeFormats = /* @__PURE__ */ computed(() => _datetimeFormats.value);
  const numberFormats = /* @__PURE__ */ computed(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return isFunction$1(_postTranslation) ? _postTranslation : null;
  }
  function setPostTranslationHandler(handler) {
    _postTranslation = handler;
    _context.postTranslation = handler;
  }
  function getMissingHandler() {
    return _missing;
  }
  function setMissingHandler(handler) {
    if (handler !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler);
    }
    _missing = handler;
    _context.missing = _runtimeMissing;
  }
  function isResolvedTranslateMessage(type, arg) {
    return type !== "translate" || !arg.resolvedMessage;
  }
  const wrapWithDeps = (fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) => {
    trackReactivityValues();
    let ret;
    try {
      if (process.env.NODE_ENV !== "production" || __INTLIFY_PROD_DEVTOOLS__) {
        setAdditionalMeta(getMetaInfo());
      }
      if (!_isGlobal) {
        _context.fallbackContext = __root ? getFallbackContext() : void 0;
      }
      ret = fn(_context);
    } finally {
      if (process.env.NODE_ENV !== "production" || __INTLIFY_PROD_DEVTOOLS__) {
        setAdditionalMeta(null);
      }
      if (!_isGlobal) {
        _context.fallbackContext = void 0;
      }
    }
    if (isNumber(ret) && ret === NOT_REOSLVED) {
      const [key, arg2] = argumentParser();
      if (process.env.NODE_ENV !== "production" && __root && isString$1(key) && isResolvedTranslateMessage(warnType, arg2)) {
        if (_fallbackRoot && (isTranslateFallbackWarn(_fallbackWarn, key) || isTranslateMissingWarn(_missingWarn, key))) {
          warn$1(getWarnMessage(I18nWarnCodes.FALLBACK_TO_ROOT, {
            key,
            type: warnType
          }));
        }
        if (process.env.NODE_ENV !== "production") {
          const { __v_emitter: emitter } = _context;
          if (emitter && _fallbackRoot) {
            emitter.emit("fallback", {
              type: warnType,
              key,
              to: "global",
              groupId: `${warnType}:${key}`
            });
          }
        }
      }
      return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
    } else if (successCondition(ret)) {
      return ret;
    } else {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE);
    }
  };
  function t(...args) {
    return wrapWithDeps((context) => Reflect.apply(translate, null, [context, ...args]), () => parseTranslateArgs(...args), "translate", (root) => Reflect.apply(root.t, root, [...args]), (key) => key, (val) => isString$1(val));
  }
  function rt(...args) {
    const [arg1, arg2, arg3] = args;
    if (arg3 && !isObject$1(arg3)) {
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
    }
    return t(...[arg1, arg2, assign$1({ resolvedMessage: true }, arg3 || {})]);
  }
  function d(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => Reflect.apply(root.d, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString$1(val));
  }
  function n(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => Reflect.apply(root.n, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString$1(val));
  }
  function normalize(values) {
    return values.map((val) => isString$1(val) || isNumber(val) || isBoolean(val) ? createTextNode(String(val)) : val);
  }
  const interpolate = (val) => val;
  const processor = {
    normalize,
    interpolate,
    type: "vnode"
  };
  function translateVNode(...args) {
    return wrapWithDeps(
      (context) => {
        let ret;
        const _context2 = context;
        try {
          _context2.processor = processor;
          ret = Reflect.apply(translate, null, [_context2, ...args]);
        } finally {
          _context2.processor = null;
        }
        return ret;
      },
      () => parseTranslateArgs(...args),
      "translate",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root) => root[TranslateVNodeSymbol](...args),
      (key) => [createTextNode(key)],
      (val) => isArray$1(val)
    );
  }
  function numberParts(...args) {
    return wrapWithDeps(
      (context) => Reflect.apply(number, null, [context, ...args]),
      () => parseNumberArgs(...args),
      "number format",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root) => root[NumberPartsSymbol](...args),
      () => [],
      (val) => isString$1(val) || isArray$1(val)
    );
  }
  function datetimeParts(...args) {
    return wrapWithDeps(
      (context) => Reflect.apply(datetime, null, [context, ...args]),
      () => parseDateTimeArgs(...args),
      "datetime format",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root) => root[DatetimePartsSymbol](...args),
      () => [],
      (val) => isString$1(val) || isArray$1(val)
    );
  }
  function setPluralRules(rules) {
    _pluralRules = rules;
    _context.pluralRules = _pluralRules;
  }
  function te(key, locale2) {
    if (!key)
      return false;
    const targetLocale = isString$1(locale2) ? locale2 : _locale.value;
    const message = getLocaleMessage(targetLocale);
    return _context.messageResolver(message, key) !== null;
  }
  function resolveMessages(key) {
    let messages2 = null;
    const locales = fallbackWithLocaleChain(_context, _fallbackLocale.value, _locale.value);
    for (let i = 0; i < locales.length; i++) {
      const targetLocaleMessages = _messages.value[locales[i]] || {};
      const messageValue = _context.messageResolver(targetLocaleMessages, key);
      if (messageValue != null) {
        messages2 = messageValue;
        break;
      }
    }
    return messages2;
  }
  function tm(key) {
    const messages2 = resolveMessages(key);
    return messages2 != null ? messages2 : __root ? __root.tm(key) || {} : {};
  }
  function getLocaleMessage(locale2) {
    return _messages.value[locale2] || {};
  }
  function setLocaleMessage(locale2, message) {
    _messages.value[locale2] = message;
    _context.messages = _messages.value;
  }
  function mergeLocaleMessage2(locale2, message) {
    _messages.value[locale2] = _messages.value[locale2] || {};
    deepCopy$1(message, _messages.value[locale2]);
    _context.messages = _messages.value;
  }
  function getDateTimeFormat(locale2) {
    return _datetimeFormats.value[locale2] || {};
  }
  function setDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = format2;
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function mergeDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = assign$1(_datetimeFormats.value[locale2] || {}, format2);
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function getNumberFormat(locale2) {
    return _numberFormats.value[locale2] || {};
  }
  function setNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = format2;
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  function mergeNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = assign$1(_numberFormats.value[locale2] || {}, format2);
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  composerID++;
  if (__root && inBrowser) {
    watch(__root.locale, (val) => {
      if (_inheritLocale) {
        _locale.value = val;
        _context.locale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
    watch(__root.fallbackLocale, (val) => {
      if (_inheritLocale) {
        _fallbackLocale.value = val;
        _context.fallbackLocale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
  }
  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale() {
      return _inheritLocale;
    },
    set inheritLocale(val) {
      _inheritLocale = val;
      if (val && __root) {
        _locale.value = __root.locale.value;
        _fallbackLocale.value = __root.fallbackLocale.value;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    },
    get availableLocales() {
      return Object.keys(_messages.value).sort();
    },
    messages,
    get modifiers() {
      return _modifiers;
    },
    get pluralRules() {
      return _pluralRules || {};
    },
    get isGlobal() {
      return _isGlobal;
    },
    get missingWarn() {
      return _missingWarn;
    },
    set missingWarn(val) {
      _missingWarn = val;
      _context.missingWarn = _missingWarn;
    },
    get fallbackWarn() {
      return _fallbackWarn;
    },
    set fallbackWarn(val) {
      _fallbackWarn = val;
      _context.fallbackWarn = _fallbackWarn;
    },
    get fallbackRoot() {
      return _fallbackRoot;
    },
    set fallbackRoot(val) {
      _fallbackRoot = val;
    },
    get fallbackFormat() {
      return _fallbackFormat;
    },
    set fallbackFormat(val) {
      _fallbackFormat = val;
      _context.fallbackFormat = _fallbackFormat;
    },
    get warnHtmlMessage() {
      return _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      _warnHtmlMessage = val;
      _context.warnHtmlMessage = val;
    },
    get escapeParameter() {
      return _escapeParameter;
    },
    set escapeParameter(val) {
      _escapeParameter = val;
      _context.escapeParameter = val;
    },
    t,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage: mergeLocaleMessage2,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [SetPluralRulesSymbol]: setPluralRules
  };
  {
    composer.datetimeFormats = datetimeFormats;
    composer.numberFormats = numberFormats;
    composer.rt = rt;
    composer.te = te;
    composer.tm = tm;
    composer.d = d;
    composer.n = n;
    composer.getDateTimeFormat = getDateTimeFormat;
    composer.setDateTimeFormat = setDateTimeFormat;
    composer.mergeDateTimeFormat = mergeDateTimeFormat;
    composer.getNumberFormat = getNumberFormat;
    composer.setNumberFormat = setNumberFormat;
    composer.mergeNumberFormat = mergeNumberFormat;
    composer[InejctWithOptionSymbol] = __injectWithOption;
    composer[TranslateVNodeSymbol] = translateVNode;
    composer[DatetimePartsSymbol] = datetimeParts;
    composer[NumberPartsSymbol] = numberParts;
  }
  if (process.env.NODE_ENV !== "production") {
    composer[EnableEmitter] = (emitter) => {
      _context.__v_emitter = emitter;
    };
    composer[DisableEmitter] = () => {
      _context.__v_emitter = void 0;
    };
  }
  return composer;
}
const baseFormatProps = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
    validator: (val) => val === "parent" || val === "global",
    default: "parent"
    /* ComponentI18nScope */
  },
  i18n: {
    type: Object
  }
};
function getInterpolateArg({ slots }, keys) {
  if (keys.length === 1 && keys[0] === "default") {
    const ret = slots.default ? slots.default() : [];
    return ret.reduce((slot, current) => {
      return [
        ...slot,
        // prettier-ignore
        ...current.type === Fragment ? current.children : [current]
      ];
    }, []);
  } else {
    return keys.reduce((arg, key) => {
      const slot = slots[key];
      if (slot) {
        arg[key] = slot();
      }
      return arg;
    }, {});
  }
}
function getFragmentableTag(tag) {
  return Fragment;
}
const TranslationImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-t",
  props: assign$1({
    keypath: {
      type: String,
      required: true
    },
    plural: {
      type: [Number, String],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validator: (val) => isNumber(val) || !isNaN(val)
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const { slots, attrs } = context;
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return () => {
      const keys = Object.keys(slots).filter((key) => key !== "_");
      const options = {};
      if (props.locale) {
        options.locale = props.locale;
      }
      if (props.plural !== void 0) {
        options.plural = isString$1(props.plural) ? +props.plural : props.plural;
      }
      const arg = getInterpolateArg(context, keys);
      const children = i18n[TranslateVNodeSymbol](props.keypath, arg, options);
      const assignedAttrs = assign$1({}, attrs);
      const tag = isString$1(props.tag) || isObject$1(props.tag) ? props.tag : getFragmentableTag();
      return h(tag, assignedAttrs, children);
    };
  }
});
const Translation = TranslationImpl;
function isVNode(target) {
  return isArray$1(target) && !isString$1(target[0]);
}
function renderFormatter(props, context, slotKeys, partFormatter) {
  const { slots, attrs } = context;
  return () => {
    const options = { part: true };
    let overrides = {};
    if (props.locale) {
      options.locale = props.locale;
    }
    if (isString$1(props.format)) {
      options.key = props.format;
    } else if (isObject$1(props.format)) {
      if (isString$1(props.format.key)) {
        options.key = props.format.key;
      }
      overrides = Object.keys(props.format).reduce((options2, prop) => {
        return slotKeys.includes(prop) ? assign$1({}, options2, { [prop]: props.format[prop] }) : options2;
      }, {});
    }
    const parts = partFormatter(...[props.value, options, overrides]);
    let children = [options.key];
    if (isArray$1(parts)) {
      children = parts.map((part, index) => {
        const slot = slots[part.type];
        const node = slot ? slot({ [part.type]: part.value, index, parts }) : [part.value];
        if (isVNode(node)) {
          node[0].key = `${part.type}-${index}`;
        }
        return node;
      });
    } else if (isString$1(parts)) {
      children = [parts];
    }
    const assignedAttrs = assign$1({}, attrs);
    const tag = isString$1(props.tag) || isObject$1(props.tag) ? props.tag : getFragmentableTag();
    return h(tag, assignedAttrs, children);
  };
}
const NumberFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-n",
  props: assign$1({
    value: {
      type: Number,
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: "parent",
      __useComponent: true
    });
    return renderFormatter(props, context, NUMBER_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n[NumberPartsSymbol](...args)
    ));
  }
});
const NumberFormat = NumberFormatImpl;
const DatetimeFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-d",
  props: assign$1({
    value: {
      type: [Number, Date],
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: "parent",
      __useComponent: true
    });
    return renderFormatter(props, context, DATETIME_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n[DatetimePartsSymbol](...args)
    ));
  }
});
const DatetimeFormat = DatetimeFormatImpl;
function getComposer$2(i18n, instance) {
  const i18nInternal = i18n;
  if (i18n.mode === "composition") {
    return i18nInternal.__getInstance(instance) || i18n.global;
  } else {
    const vueI18n = i18nInternal.__getInstance(instance);
    return vueI18n != null ? vueI18n.__composer : i18n.global.__composer;
  }
}
function vTDirective(i18n) {
  const _process = (binding) => {
    const { instance, modifiers, value } = binding;
    if (!instance || !instance.$) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const composer = getComposer$2(i18n, instance.$);
    if (process.env.NODE_ENV !== "production" && modifiers.preserve) {
      warn$1(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE));
    }
    const parsedValue = parseValue(value);
    return [
      Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]),
      composer
    ];
  };
  const register = (el, binding) => {
    const [textContent, composer] = _process(binding);
    el.__composer = composer;
    el.textContent = textContent;
  };
  const unregister = (el) => {
    if (el.__composer) {
      el.__composer = void 0;
      delete el.__composer;
    }
  };
  const update = (el, { value }) => {
    if (el.__composer) {
      const composer = el.__composer;
      const parsedValue = parseValue(value);
      el.textContent = Reflect.apply(composer.t, composer, [
        ...makeParams(parsedValue)
      ]);
    }
  };
  const getSSRProps = (binding) => {
    const [textContent] = _process(binding);
    return { textContent };
  };
  return {
    created: register,
    unmounted: unregister,
    beforeUpdate: update,
    getSSRProps
  };
}
function parseValue(value) {
  if (isString$1(value)) {
    return { path: value };
  } else if (isPlainObject(value)) {
    if (!("path" in value)) {
      throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, "path");
    }
    return value;
  } else {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
}
function makeParams(value) {
  const { path, locale, args, choice, plural } = value;
  const options = {};
  const named = args || {};
  if (isString$1(locale)) {
    options.locale = locale;
  }
  if (isNumber(choice)) {
    options.plural = choice;
  }
  if (isNumber(plural)) {
    options.plural = plural;
  }
  return [path, named, options];
}
function apply(app, i18n, ...options) {
  const pluginOptions = isPlainObject(options[0]) ? options[0] : {};
  const useI18nComponentName = !!pluginOptions.useI18nComponentName;
  const globalInstall = isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true;
  if (process.env.NODE_ENV !== "production" && globalInstall && useI18nComponentName) {
    warn$1(getWarnMessage(I18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE, {
      name: Translation.name
    }));
  }
  if (globalInstall) {
    [!useI18nComponentName ? Translation.name : "i18n", "I18nT"].forEach((name) => app.component(name, Translation));
    [NumberFormat.name, "I18nN"].forEach((name) => app.component(name, NumberFormat));
    [DatetimeFormat.name, "I18nD"].forEach((name) => app.component(name, DatetimeFormat));
  }
  {
    app.directive("t", vTDirective(i18n));
  }
}
const VueDevToolsLabels = {
  [
    "vue-devtools-plugin-vue-i18n"
    /* VueDevToolsIDs.PLUGIN */
  ]: "Vue I18n devtools",
  [
    "vue-i18n-resource-inspector"
    /* VueDevToolsIDs.CUSTOM_INSPECTOR */
  ]: "I18n Resources",
  [
    "vue-i18n-timeline"
    /* VueDevToolsIDs.TIMELINE */
  ]: "Vue I18n"
};
const VueDevToolsPlaceholders = {
  [
    "vue-i18n-resource-inspector"
    /* VueDevToolsIDs.CUSTOM_INSPECTOR */
  ]: "Search for scopes ..."
};
const VueDevToolsTimelineColors = {
  [
    "vue-i18n-timeline"
    /* VueDevToolsIDs.TIMELINE */
  ]: 16764185
};
const VUE_I18N_COMPONENT_TYPES = "vue-i18n: composer properties";
let devtoolsApi;
async function enableDevTools(app, i18n) {
  return new Promise((resolve2, reject) => {
    try {
      setupDevtoolsPlugin({
        id: "vue-devtools-plugin-vue-i18n",
        label: VueDevToolsLabels[
          "vue-devtools-plugin-vue-i18n"
          /* VueDevToolsIDs.PLUGIN */
        ],
        packageName: "vue-i18n",
        homepage: "https://vue-i18n.intlify.dev",
        logo: "https://vue-i18n.intlify.dev/vue-i18n-devtools-logo.png",
        componentStateTypes: [VUE_I18N_COMPONENT_TYPES],
        app
        // eslint-disable-line @typescript-eslint/no-explicit-any
      }, (api) => {
        devtoolsApi = api;
        api.on.visitComponentTree(({ componentInstance, treeNode }) => {
          updateComponentTreeTags(componentInstance, treeNode, i18n);
        });
        api.on.inspectComponent(({ componentInstance, instanceData }) => {
          if (componentInstance.vnode.el && componentInstance.vnode.el.__VUE_I18N__ && instanceData) {
            if (i18n.mode === "legacy") {
              if (componentInstance.vnode.el.__VUE_I18N__ !== i18n.global.__composer) {
                inspectComposer(instanceData, componentInstance.vnode.el.__VUE_I18N__);
              }
            } else {
              inspectComposer(instanceData, componentInstance.vnode.el.__VUE_I18N__);
            }
          }
        });
        api.addInspector({
          id: "vue-i18n-resource-inspector",
          label: VueDevToolsLabels[
            "vue-i18n-resource-inspector"
            /* VueDevToolsIDs.CUSTOM_INSPECTOR */
          ],
          icon: "language",
          treeFilterPlaceholder: VueDevToolsPlaceholders[
            "vue-i18n-resource-inspector"
            /* VueDevToolsIDs.CUSTOM_INSPECTOR */
          ]
        });
        api.on.getInspectorTree((payload) => {
          if (payload.app === app && payload.inspectorId === "vue-i18n-resource-inspector") {
            registerScope(payload, i18n);
          }
        });
        const roots = /* @__PURE__ */ new Map();
        api.on.getInspectorState(async (payload) => {
          if (payload.app === app && payload.inspectorId === "vue-i18n-resource-inspector") {
            api.unhighlightElement();
            inspectScope(payload, i18n);
            if (payload.nodeId === "global") {
              if (!roots.has(payload.app)) {
                const [root] = await api.getComponentInstances(payload.app);
                roots.set(payload.app, root);
              }
              api.highlightElement(roots.get(payload.app));
            } else {
              const instance = getComponentInstance(payload.nodeId, i18n);
              instance && api.highlightElement(instance);
            }
          }
        });
        api.on.editInspectorState((payload) => {
          if (payload.app === app && payload.inspectorId === "vue-i18n-resource-inspector") {
            editScope(payload, i18n);
          }
        });
        api.addTimelineLayer({
          id: "vue-i18n-timeline",
          label: VueDevToolsLabels[
            "vue-i18n-timeline"
            /* VueDevToolsIDs.TIMELINE */
          ],
          color: VueDevToolsTimelineColors[
            "vue-i18n-timeline"
            /* VueDevToolsIDs.TIMELINE */
          ]
        });
        resolve2(true);
      });
    } catch (e) {
      console.error(e);
      reject(false);
    }
  });
}
function getI18nScopeLable(instance) {
  return instance.type.name || instance.type.displayName || instance.type.__file || "Anonymous";
}
function updateComponentTreeTags(instance, treeNode, i18n) {
  const global2 = i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
  if (instance && instance.vnode.el && instance.vnode.el.__VUE_I18N__) {
    if (instance.vnode.el.__VUE_I18N__ !== global2) {
      const tag = {
        label: `i18n (${getI18nScopeLable(instance)} Scope)`,
        textColor: 0,
        backgroundColor: 16764185
      };
      treeNode.tags.push(tag);
    }
  }
}
function inspectComposer(instanceData, composer) {
  const type = VUE_I18N_COMPONENT_TYPES;
  instanceData.state.push({
    type,
    key: "locale",
    editable: true,
    value: composer.locale.value
  });
  instanceData.state.push({
    type,
    key: "availableLocales",
    editable: false,
    value: composer.availableLocales
  });
  instanceData.state.push({
    type,
    key: "fallbackLocale",
    editable: true,
    value: composer.fallbackLocale.value
  });
  instanceData.state.push({
    type,
    key: "inheritLocale",
    editable: true,
    value: composer.inheritLocale
  });
  instanceData.state.push({
    type,
    key: "messages",
    editable: false,
    value: getLocaleMessageValue(composer.messages.value)
  });
  {
    instanceData.state.push({
      type,
      key: "datetimeFormats",
      editable: false,
      value: composer.datetimeFormats.value
    });
    instanceData.state.push({
      type,
      key: "numberFormats",
      editable: false,
      value: composer.numberFormats.value
    });
  }
}
function getLocaleMessageValue(messages) {
  const value = {};
  Object.keys(messages).forEach((key) => {
    const v = messages[key];
    if (isFunction$1(v) && "source" in v) {
      value[key] = getMessageFunctionDetails(v);
    } else if (isMessageAST(v) && v.loc && v.loc.source) {
      value[key] = v.loc.source;
    } else if (isObject$1(v)) {
      value[key] = getLocaleMessageValue(v);
    } else {
      value[key] = v;
    }
  });
  return value;
}
const ESC = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "&": "&amp;"
};
function escape(s) {
  return s.replace(/[<>"&]/g, escapeChar);
}
function escapeChar(a) {
  return ESC[a] || a;
}
function getMessageFunctionDetails(func) {
  const argString = func.source ? `("${escape(func.source)}")` : `(?)`;
  return {
    _custom: {
      type: "function",
      display: `<span>ƒ</span> ${argString}`
    }
  };
}
function registerScope(payload, i18n) {
  payload.rootNodes.push({
    id: "global",
    label: "Global Scope"
  });
  const global2 = i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
  for (const [keyInstance, instance] of i18n.__instances) {
    const composer = i18n.mode === "composition" ? instance : instance.__composer;
    if (global2 === composer) {
      continue;
    }
    payload.rootNodes.push({
      id: composer.id.toString(),
      label: `${getI18nScopeLable(keyInstance)} Scope`
    });
  }
}
function getComponentInstance(nodeId, i18n) {
  let instance = null;
  if (nodeId !== "global") {
    for (const [component, composer] of i18n.__instances.entries()) {
      if (composer.id.toString() === nodeId) {
        instance = component;
        break;
      }
    }
  }
  return instance;
}
function getComposer$1(nodeId, i18n) {
  if (nodeId === "global") {
    return i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
  } else {
    const instance = Array.from(i18n.__instances.values()).find((item) => item.id.toString() === nodeId);
    if (instance) {
      return i18n.mode === "composition" ? instance : instance.__composer;
    } else {
      return null;
    }
  }
}
function inspectScope(payload, i18n) {
  const composer = getComposer$1(payload.nodeId, i18n);
  if (composer) {
    payload.state = makeScopeInspectState(composer);
  }
  return null;
}
function makeScopeInspectState(composer) {
  const state = {};
  const localeType = "Locale related info";
  const localeStates = [
    {
      type: localeType,
      key: "locale",
      editable: true,
      value: composer.locale.value
    },
    {
      type: localeType,
      key: "fallbackLocale",
      editable: true,
      value: composer.fallbackLocale.value
    },
    {
      type: localeType,
      key: "availableLocales",
      editable: false,
      value: composer.availableLocales
    },
    {
      type: localeType,
      key: "inheritLocale",
      editable: true,
      value: composer.inheritLocale
    }
  ];
  state[localeType] = localeStates;
  const localeMessagesType = "Locale messages info";
  const localeMessagesStates = [
    {
      type: localeMessagesType,
      key: "messages",
      editable: false,
      value: getLocaleMessageValue(composer.messages.value)
    }
  ];
  state[localeMessagesType] = localeMessagesStates;
  {
    const datetimeFormatsType = "Datetime formats info";
    const datetimeFormatsStates = [
      {
        type: datetimeFormatsType,
        key: "datetimeFormats",
        editable: false,
        value: composer.datetimeFormats.value
      }
    ];
    state[datetimeFormatsType] = datetimeFormatsStates;
    const numberFormatsType = "Datetime formats info";
    const numberFormatsStates = [
      {
        type: numberFormatsType,
        key: "numberFormats",
        editable: false,
        value: composer.numberFormats.value
      }
    ];
    state[numberFormatsType] = numberFormatsStates;
  }
  return state;
}
function addTimelineEvent(event, payload) {
  if (devtoolsApi) {
    let groupId;
    if (payload && "groupId" in payload) {
      groupId = payload.groupId;
      delete payload.groupId;
    }
    devtoolsApi.addTimelineEvent({
      layerId: "vue-i18n-timeline",
      event: {
        title: event,
        groupId,
        time: Date.now(),
        meta: {},
        data: payload || {},
        logType: event === "compile-error" ? "error" : event === "fallback" || event === "missing" ? "warning" : "default"
      }
    });
  }
}
function editScope(payload, i18n) {
  const composer = getComposer$1(payload.nodeId, i18n);
  if (composer) {
    const [field] = payload.path;
    if (field === "locale" && isString$1(payload.state.value)) {
      composer.locale.value = payload.state.value;
    } else if (field === "fallbackLocale" && (isString$1(payload.state.value) || isArray$1(payload.state.value) || isObject$1(payload.state.value))) {
      composer.fallbackLocale.value = payload.state.value;
    } else if (field === "inheritLocale" && isBoolean(payload.state.value)) {
      composer.inheritLocale = payload.state.value;
    }
  }
}
const I18nInjectionKey = /* @__PURE__ */ makeSymbol$1("global-vue-i18n");
function createI18n(options = {}, VueI18nLegacy) {
  const __globalInjection = isBoolean(options.globalInjection) ? options.globalInjection : true;
  const __allowComposition = true;
  const __instances = /* @__PURE__ */ new Map();
  const [globalScope, __global] = createGlobal(options);
  const symbol = /* @__PURE__ */ makeSymbol$1(process.env.NODE_ENV !== "production" ? "vue-i18n" : "");
  if (process.env.NODE_ENV !== "production")
    ;
  function __getInstance(component) {
    return __instances.get(component) || null;
  }
  function __setInstance(component, instance) {
    __instances.set(component, instance);
  }
  function __deleteInstance(component) {
    __instances.delete(component);
  }
  {
    const i18n = {
      // mode
      get mode() {
        return "composition";
      },
      // allowComposition
      get allowComposition() {
        return __allowComposition;
      },
      // install plugin
      async install(app, ...options2) {
        if ((process.env.NODE_ENV !== "production" || false) && true) {
          app.__VUE_I18N__ = i18n;
        }
        app.__VUE_I18N_SYMBOL__ = symbol;
        app.provide(app.__VUE_I18N_SYMBOL__, i18n);
        if (isPlainObject(options2[0])) {
          const opts = options2[0];
          i18n.__composerExtend = opts.__composerExtend;
          i18n.__vueI18nExtend = opts.__vueI18nExtend;
        }
        let globalReleaseHandler = null;
        if (__globalInjection) {
          globalReleaseHandler = injectGlobalFields(app, i18n.global);
        }
        {
          apply(app, i18n, ...options2);
        }
        const unmountApp = app.unmount;
        app.unmount = () => {
          globalReleaseHandler && globalReleaseHandler();
          i18n.dispose();
          unmountApp();
        };
        if ((process.env.NODE_ENV !== "production" || false) && true) {
          const ret = await enableDevTools(app, i18n);
          if (!ret) {
            throw createI18nError(I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN);
          }
          const emitter = createEmitter();
          {
            const _composer = __global;
            _composer[EnableEmitter] && _composer[EnableEmitter](emitter);
          }
          emitter.on("*", addTimelineEvent);
        }
      },
      // global accessor
      get global() {
        return __global;
      },
      dispose() {
        globalScope.stop();
      },
      // @internal
      __instances,
      // @internal
      __getInstance,
      // @internal
      __setInstance,
      // @internal
      __deleteInstance
    };
    return i18n;
  }
}
function useI18n(options = {}) {
  const instance = getCurrentInstance();
  if (instance == null) {
    throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP);
  }
  if (!instance.isCE && instance.appContext.app != null && !instance.appContext.app.__VUE_I18N_SYMBOL__) {
    throw createI18nError(I18nErrorCodes.NOT_INSTALLED);
  }
  const i18n = getI18nInstance(instance);
  const gl = getGlobalComposer(i18n);
  const componentOptions = getComponentOptions(instance);
  const scope = getScope(options, componentOptions);
  if (scope === "global") {
    adjustI18nResources(gl, options, componentOptions);
    return gl;
  }
  if (scope === "parent") {
    let composer2 = getComposer$3(i18n, instance, options.__useComponent);
    if (composer2 == null) {
      if (process.env.NODE_ENV !== "production") {
        warn$1(getWarnMessage(I18nWarnCodes.NOT_FOUND_PARENT_SCOPE));
      }
      composer2 = gl;
    }
    return composer2;
  }
  const i18nInternal = i18n;
  let composer = i18nInternal.__getInstance(instance);
  if (composer == null) {
    const composerOptions = assign$1({}, options);
    if ("__i18n" in componentOptions) {
      composerOptions.__i18n = componentOptions.__i18n;
    }
    if (gl) {
      composerOptions.__root = gl;
    }
    composer = createComposer(composerOptions);
    if (i18nInternal.__composerExtend) {
      composer[DisposeSymbol] = i18nInternal.__composerExtend(composer);
    }
    setupLifeCycle(i18nInternal, instance, composer);
    i18nInternal.__setInstance(instance, composer);
  }
  return composer;
}
function createGlobal(options, legacyMode, VueI18nLegacy) {
  const scope = effectScope();
  {
    const obj = scope.run(() => createComposer(options));
    if (obj == null) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    return [scope, obj];
  }
}
function getI18nInstance(instance) {
  {
    const i18n = inject(!instance.isCE ? instance.appContext.app.__VUE_I18N_SYMBOL__ : I18nInjectionKey);
    if (!i18n) {
      throw createI18nError(!instance.isCE ? I18nErrorCodes.UNEXPECTED_ERROR : I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE);
    }
    return i18n;
  }
}
function getScope(options, componentOptions) {
  return isEmptyObject(options) ? "__i18n" in componentOptions ? "local" : "global" : !options.useScope ? "local" : options.useScope;
}
function getGlobalComposer(i18n) {
  return i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
}
function getComposer$3(i18n, target, useComponent = false) {
  let composer = null;
  const root = target.root;
  let current = getParentComponentInstance(target, useComponent);
  while (current != null) {
    const i18nInternal = i18n;
    if (i18n.mode === "composition") {
      composer = i18nInternal.__getInstance(current);
    }
    if (composer != null) {
      break;
    }
    if (root === current) {
      break;
    }
    current = current.parent;
  }
  return composer;
}
function getParentComponentInstance(target, useComponent = false) {
  if (target == null) {
    return null;
  }
  {
    return !useComponent ? target.parent : target.vnode.ctx || target.parent;
  }
}
function setupLifeCycle(i18n, target, composer) {
  {
    onUnmounted(() => {
      const _composer = composer;
      if ((process.env.NODE_ENV !== "production" || false) && true && target.vnode.el && target.vnode.el.__VUE_I18N__) {
        _composer[DisableEmitter] && _composer[DisableEmitter]();
        delete target.vnode.el.__VUE_I18N__;
      }
      i18n.__deleteInstance(target);
      const dispose = _composer[DisposeSymbol];
      if (dispose) {
        dispose();
        delete _composer[DisposeSymbol];
      }
    }, target);
  }
}
const globalExportProps = [
  "locale",
  "fallbackLocale",
  "availableLocales"
];
const globalExportMethods = ["t", "rt", "d", "n", "tm", "te"];
function injectGlobalFields(app, composer) {
  const i18n = /* @__PURE__ */ Object.create(null);
  globalExportProps.forEach((prop) => {
    const desc = Object.getOwnPropertyDescriptor(composer, prop);
    if (!desc) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const wrap = isRef(desc.value) ? {
      get() {
        return desc.value.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(val) {
        desc.value.value = val;
      }
    } : {
      get() {
        return desc.get && desc.get();
      }
    };
    Object.defineProperty(i18n, prop, wrap);
  });
  app.config.globalProperties.$i18n = i18n;
  globalExportMethods.forEach((method) => {
    const desc = Object.getOwnPropertyDescriptor(composer, method);
    if (!desc || !desc.value) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    Object.defineProperty(app.config.globalProperties, `$${method}`, desc);
  });
  const dispose = () => {
    delete app.config.globalProperties.$i18n;
    globalExportMethods.forEach((method) => {
      delete app.config.globalProperties[`$${method}`];
    });
  };
  return dispose;
}
{
  initFeatureFlags();
}
{
  registerMessageCompiler(compile);
}
registerMessageResolver(resolveValue);
registerLocaleFallbacker(fallbackWithLocaleChain);
if (process.env.NODE_ENV !== "production" || __INTLIFY_PROD_DEVTOOLS__) {
  const target = getGlobalThis();
  target.__INTLIFY__ = true;
  setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}
if (process.env.NODE_ENV !== "production")
  ;
const STRATEGIES = {
  PREFIX: "prefix",
  PREFIX_EXCEPT_DEFAULT: "prefix_except_default",
  PREFIX_AND_DEFAULT: "prefix_and_default",
  NO_PREFIX: "no_prefix"
};
const DEFAULT_LOCALE = "";
const DEFAULT_STRATEGY = STRATEGIES.PREFIX_EXCEPT_DEFAULT;
const DEFAULT_TRAILING_SLASH = false;
const DEFAULT_ROUTES_NAME_SEPARATOR = "___";
const DEFAULT_LOCALE_ROUTE_NAME_SUFFIX = "default";
const DEFAULT_DETECTION_DIRECTION = "ltr";
const DEFAULT_BASE_URL = "";
const DEFAULT_DYNAMIC_PARAMS_KEY = "";
/*!
  * shared v9.4.1
  * (c) 2023 kazuya kawaguchi
  * Released under the MIT License.
  */
const makeSymbol = (name, shareable = false) => !shareable ? Symbol(name) : Symbol.for(name);
const assign = Object.assign;
const isArray = Array.isArray;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const TRAILING_SLASH_RE = /\/$|\/\?/;
function hasTrailingSlash(input = "", queryParameters = false) {
  if (!queryParameters) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", queryParameters = false) {
  if (!queryParameters) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  const [s0, ...s] = input.split("?");
  return (s0.slice(0, -1) || "/") + (s.length > 0 ? `?${s.join("?")}` : "");
}
function withTrailingSlash(input = "", queryParameters = false) {
  if (!queryParameters) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  const [s0, ...s] = input.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "");
}
function warn(msg, err) {
  if (typeof console !== "undefined") {
    console.warn(`[vue-i18n-routing] ` + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}
function getNormalizedLocales(locales) {
  locales = locales || [];
  const normalized = [];
  for (const locale of locales) {
    if (isString(locale)) {
      normalized.push({ code: locale });
    } else {
      normalized.push(locale);
    }
  }
  return normalized;
}
function isI18nInstance(i18n) {
  return i18n != null && "global" in i18n && "mode" in i18n;
}
function isComposer(target) {
  return target != null && !("__composer" in target) && isRef(target.locale);
}
function isVueI18n(target) {
  return target != null && "__composer" in target;
}
function isExportedGlobalComposer(target) {
  return target != null && !("__composer" in target) && !isRef(target.locale);
}
function isLegacyVueI18n$1(target) {
  return target != null && ("__VUE_I18N_BRIDGE__" in target || "_sync" in target);
}
function getComposer(i18n) {
  return isI18nInstance(i18n) ? isComposer(i18n.global) ? i18n.global : i18n.global.__composer : isVueI18n(i18n) ? i18n.__composer : i18n;
}
function getLocale(i18n) {
  const target = isI18nInstance(i18n) ? i18n.global : i18n;
  return isComposer(target) ? target.locale.value : isExportedGlobalComposer(target) || isVueI18n(target) || isLegacyVueI18n$1(target) ? target.locale : target.locale;
}
function getLocales(i18n) {
  const target = isI18nInstance(i18n) ? i18n.global : i18n;
  return isComposer(target) ? target.locales.value : isExportedGlobalComposer(target) || isVueI18n(target) || isLegacyVueI18n$1(target) ? target.locales : target.locales;
}
function getLocaleCodes(i18n) {
  const target = isI18nInstance(i18n) ? i18n.global : i18n;
  return isComposer(target) ? target.localeCodes.value : isExportedGlobalComposer(target) || isVueI18n(target) || isLegacyVueI18n$1(target) ? target.localeCodes : target.localeCodes;
}
function setLocale(i18n, locale) {
  const target = isI18nInstance(i18n) ? i18n.global : i18n;
  if (isComposer(target)) {
    {
      target.locale.value = locale;
    }
  } else if (isExportedGlobalComposer(target) || isVueI18n(target) || isLegacyVueI18n$1(target)) {
    target.locale = locale;
  } else {
    throw new Error("TODO:");
  }
}
function getRouteName(routeName) {
  return isString(routeName) ? routeName : isSymbol(routeName) ? routeName.toString() : "(null)";
}
function getLocaleRouteName(routeName, locale, {
  defaultLocale,
  strategy,
  routesNameSeparator,
  defaultLocaleRouteNameSuffix
}) {
  let name = getRouteName(routeName) + (strategy === "no_prefix" ? "" : routesNameSeparator + locale);
  if (locale === defaultLocale && strategy === "prefix_and_default") {
    name += routesNameSeparator + defaultLocaleRouteNameSuffix;
  }
  return name;
}
function resolveBaseUrl(baseUrl2, context) {
  if (isFunction(baseUrl2)) {
    return baseUrl2(context);
  }
  return baseUrl2;
}
function matchBrowserLocale(locales, browserLocales) {
  const matchedLocales = [];
  for (const [index, browserCode] of browserLocales.entries()) {
    const matchedLocale = locales.find((l) => l.iso.toLowerCase() === browserCode.toLowerCase());
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 1 - index / browserLocales.length });
      break;
    }
  }
  for (const [index, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split("-")[0].toLowerCase();
    const matchedLocale = locales.find((l) => l.iso.split("-")[0].toLowerCase() === languageCode);
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 0.999 - index / browserLocales.length });
      break;
    }
  }
  return matchedLocales;
}
const DefaultBrowserLocaleMatcher = matchBrowserLocale;
function compareBrowserLocale(a, b) {
  if (a.score === b.score) {
    return b.code.length - a.code.length;
  }
  return b.score - a.score;
}
const DefaultBrowerLocaleComparer = compareBrowserLocale;
function findBrowserLocale(locales, browserLocales, { matcher = DefaultBrowserLocaleMatcher, comparer = DefaultBrowerLocaleComparer } = {}) {
  const normalizedLocales = [];
  for (const l of locales) {
    const { code: code2 } = l;
    const iso = l.iso || code2;
    normalizedLocales.push({ code: code2, iso });
  }
  const matchedLocales = matcher(normalizedLocales, browserLocales);
  if (matchedLocales.length > 1) {
    matchedLocales.sort(comparer);
  }
  return matchedLocales.length ? matchedLocales[0].code : "";
}
function proxyVueInstance(target) {
  return function() {
    return Reflect.apply(
      target,
      {
        getRouteBaseName: this.getRouteBaseName,
        localePath: this.localePath,
        localeRoute: this.localeRoute,
        localeLocation: this.localeLocation,
        resolveRoute: this.resolveRoute,
        switchLocalePath: this.switchLocalePath,
        localeHead: this.localeHead,
        i18n: this.$i18n,
        route: this.$route,
        router: this.$router
      },
      // eslint-disable-next-line prefer-rest-params
      arguments
    );
  };
}
function extendI18n(i18n, {
  locales = [],
  localeCodes: localeCodes2 = [],
  baseUrl: baseUrl2 = DEFAULT_BASE_URL,
  hooks = {},
  context = {}
} = {}) {
  const scope = effectScope();
  const orgInstall = i18n.install;
  i18n.install = (vue, ...options) => {
    const pluginOptions = isPluginOptions(options[0]) ? assign({}, options[0]) : { inject: true };
    if (pluginOptions.inject == null) {
      pluginOptions.inject = true;
    }
    const orgComposerExtend = pluginOptions.__composerExtend;
    pluginOptions.__composerExtend = (localComposer) => {
      const globalComposer2 = getComposer(i18n);
      localComposer.locales = computed(() => globalComposer2.locales.value);
      localComposer.localeCodes = computed(() => globalComposer2.localeCodes.value);
      localComposer.baseUrl = computed(() => globalComposer2.baseUrl.value);
      let orgComposerDispose;
      if (isFunction(orgComposerExtend)) {
        orgComposerDispose = Reflect.apply(orgComposerExtend, pluginOptions, [localComposer]);
      }
      return () => {
        orgComposerDispose && orgComposerDispose();
      };
    };
    if (i18n.mode === "legacy") {
      const orgVueI18nExtend = pluginOptions.__vueI18nExtend;
      pluginOptions.__vueI18nExtend = (vueI18n) => {
        extendVueI18n(vueI18n, hooks.onExtendVueI18n);
        let orgVueI18nDispose;
        if (isFunction(orgVueI18nExtend)) {
          orgVueI18nDispose = Reflect.apply(orgVueI18nExtend, pluginOptions, [vueI18n]);
        }
        return () => {
          orgVueI18nDispose && orgVueI18nDispose();
        };
      };
    }
    options[0] = pluginOptions;
    Reflect.apply(orgInstall, i18n, [vue, ...options]);
    const globalComposer = getComposer(i18n);
    scope.run(() => {
      extendComposer(globalComposer, { locales, localeCodes: localeCodes2, baseUrl: baseUrl2, hooks, context });
      if (i18n.mode === "legacy" && isVueI18n(i18n.global)) {
        extendVueI18n(i18n.global, hooks.onExtendVueI18n);
      }
    });
    const app = vue;
    const exported = i18n.mode === "composition" ? app.config.globalProperties.$i18n : null;
    if (exported) {
      extendExportedGlobal(exported, globalComposer, hooks.onExtendExportedGlobal);
    }
    if (pluginOptions.inject) {
      vue.mixin({
        methods: {
          resolveRoute: proxyVueInstance(resolveRoute),
          localePath: proxyVueInstance(localePath),
          localeRoute: proxyVueInstance(localeRoute),
          localeLocation: proxyVueInstance(localeLocation),
          switchLocalePath: proxyVueInstance(switchLocalePath),
          getRouteBaseName: proxyVueInstance(getRouteBaseName),
          localeHead: proxyVueInstance(localeHead)
        }
      });
    }
    if (app.unmount) {
      const unmountApp = app.unmount;
      app.unmount = () => {
        scope.stop();
        unmountApp();
      };
    }
  };
  return scope;
}
function extendComposer(composer, options) {
  const { locales, localeCodes: localeCodes2, baseUrl: baseUrl2, context } = options;
  const _locales = ref(locales);
  const _localeCodes = ref(localeCodes2);
  const _baseUrl = ref("");
  composer.locales = computed(() => _locales.value);
  composer.localeCodes = computed(() => _localeCodes.value);
  composer.baseUrl = computed(() => _baseUrl.value);
  {
    _baseUrl.value = resolveBaseUrl(baseUrl2, context);
  }
  if (options.hooks && options.hooks.onExtendComposer) {
    options.hooks.onExtendComposer(composer);
  }
}
function extendProperyDescripters(composer, exported, hook) {
  const properties = [
    {
      locales: {
        get() {
          return composer.locales.value;
        }
      },
      localeCodes: {
        get() {
          return composer.localeCodes.value;
        }
      },
      baseUrl: {
        get() {
          return composer.baseUrl.value;
        }
      }
    }
  ];
  hook && properties.push(hook(composer));
  for (const property of properties) {
    for (const [key, descriptor] of Object.entries(property)) {
      Object.defineProperty(exported, key, descriptor);
    }
  }
}
function extendExportedGlobal(exported, g, hook) {
  extendProperyDescripters(g, exported, hook);
}
function extendVueI18n(vueI18n, hook) {
  const c = getComposer(vueI18n);
  extendProperyDescripters(c, vueI18n, hook);
}
function isPluginOptions(options) {
  return isObject(options) && ("inject" in options || "__composerExtend" in options || "__vueI18nExtend" in options);
}
const GlobalOptionsRegistory = makeSymbol("vue-i18n-routing-gor");
function registerGlobalOptions(router, options) {
  const _options = router[GlobalOptionsRegistory];
  if (_options) {
    warn("already registered global options");
  } else {
    router[GlobalOptionsRegistory] = options;
  }
}
function getGlobalOptions(router) {
  return router[GlobalOptionsRegistory] ?? {};
}
function getLocalesRegex(localeCodes2) {
  return new RegExp(`^/(${localeCodes2.join("|")})(?:/|$)`, "i");
}
function createLocaleFromRouteGetter(localeCodes2, routesNameSeparator, defaultLocaleRouteNameSuffix) {
  const localesPattern = `(${localeCodes2.join("|")})`;
  const defaultSuffixPattern = `(?:${routesNameSeparator}${defaultLocaleRouteNameSuffix})?`;
  const regexpName = new RegExp(`${routesNameSeparator}${localesPattern}${defaultSuffixPattern}$`, "i");
  const regexpPath = getLocalesRegex(localeCodes2);
  const getLocaleFromRoute = (route) => {
    if (isObject(route)) {
      if (route.name) {
        const name = isString(route.name) ? route.name : route.name.toString();
        const matches = name.match(regexpName);
        if (matches && matches.length > 1) {
          return matches[1];
        }
      } else if (route.path) {
        const matches = route.path.match(regexpPath);
        if (matches && matches.length > 1) {
          return matches[1];
        }
      }
    } else if (isString(route)) {
      const matches = route.match(regexpPath);
      if (matches && matches.length > 1) {
        return matches[1];
      }
    }
    return "";
  };
  return getLocaleFromRoute;
}
function getI18nRoutingOptions(router, proxy, {
  defaultLocale = DEFAULT_LOCALE,
  defaultDirection = DEFAULT_DETECTION_DIRECTION,
  defaultLocaleRouteNameSuffix = DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  routesNameSeparator = DEFAULT_ROUTES_NAME_SEPARATOR,
  strategy = DEFAULT_STRATEGY,
  trailingSlash = DEFAULT_TRAILING_SLASH,
  localeCodes: localeCodes2 = [],
  prefixable: prefixable2 = DefaultPrefixable,
  switchLocalePathIntercepter = DefaultSwitchLocalePathIntercepter,
  dynamicRouteParamsKey = DEFAULT_DYNAMIC_PARAMS_KEY
} = {}) {
  const options = getGlobalOptions(router);
  return {
    defaultLocale: proxy.defaultLocale || options.defaultLocale || defaultLocale,
    defaultDirection: proxy.defaultDirection || options.defaultDirection || defaultDirection,
    defaultLocaleRouteNameSuffix: proxy.defaultLocaleRouteNameSuffix || options.defaultLocaleRouteNameSuffix || defaultLocaleRouteNameSuffix,
    routesNameSeparator: proxy.routesNameSeparator || options.routesNameSeparator || routesNameSeparator,
    strategy: proxy.strategy || options.strategy || strategy,
    trailingSlash: proxy.trailingSlash || options.trailingSlash || trailingSlash,
    localeCodes: proxy.localeCodes || options.localeCodes || localeCodes2,
    prefixable: proxy.prefixable || options.prefixable || prefixable2,
    switchLocalePathIntercepter: proxy.switchLocalePathIntercepter || options.switchLocalePathIntercepter || switchLocalePathIntercepter,
    dynamicRouteParamsKey: proxy.dynamicRouteParamsKey || options.dynamicRouteParamsKey || dynamicRouteParamsKey
  };
}
function split(str, index) {
  const result = [str.slice(0, index), str.slice(index)];
  return result;
}
function routeToObject(route) {
  const { fullPath, query, hash, name, path, params, meta, redirectedFrom, matched } = route;
  return {
    fullPath,
    params,
    query,
    hash,
    name,
    path,
    meta,
    matched,
    redirectedFrom
  };
}
function resolve(router, route, strategy, locale) {
  if (strategy === "prefix") {
    if (isArray(route.matched) && route.matched.length > 0) {
      return route.matched[0];
    }
    const [rootSlash, restPath] = split(route.path, 1);
    const targetPath = `${rootSlash}${locale}${restPath === "" ? restPath : `/${restPath}`}`;
    const _route = router.options.routes.find((r) => r.path === targetPath);
    if (_route == null) {
      return route;
    } else {
      const _resolvableRoute = assign({}, route, _route);
      _resolvableRoute.path = targetPath;
      return router.resolve(_resolvableRoute);
    }
  } else {
    return router.resolve(route);
  }
}
const RESOLVED_PREFIXED = /* @__PURE__ */ new Set(["prefix_and_default", "prefix_except_default"]);
function prefixable(optons) {
  const { currentLocale, defaultLocale, strategy } = optons;
  const isDefaultLocale = currentLocale === defaultLocale;
  return !(isDefaultLocale && RESOLVED_PREFIXED.has(strategy)) && // no prefix for any language
  !(strategy === "no_prefix");
}
const DefaultPrefixable = prefixable;
function getRouteBaseName(givenRoute) {
  const router = this.router;
  const { routesNameSeparator } = getI18nRoutingOptions(router, this);
  const route = givenRoute != null ? isRef(givenRoute) ? unref(givenRoute) : givenRoute : this.route;
  if (route == null || !route.name) {
    return;
  }
  const name = getRouteName(route.name);
  return name.split(routesNameSeparator)[0];
}
function localePath(route, locale) {
  const localizedRoute = resolveRoute.call(this, route, locale);
  return localizedRoute == null ? "" : localizedRoute.redirectedFrom || localizedRoute.fullPath;
}
function localeRoute(route, locale) {
  const resolved = resolveRoute.call(this, route, locale);
  return resolved == null ? void 0 : resolved;
}
function localeLocation(route, locale) {
  const resolved = resolveRoute.call(this, route, locale);
  return resolved == null ? void 0 : resolved;
}
function resolveRoute(route, locale) {
  const router = this.router;
  const i18n = this.i18n;
  const _locale = locale || getLocale(i18n);
  const { routesNameSeparator, defaultLocale, defaultLocaleRouteNameSuffix, strategy, trailingSlash, prefixable: prefixable2 } = getI18nRoutingOptions(router, this);
  let _route = route;
  if (isString(route)) {
    if (_route[0] === "/") {
      const [path, search] = route.split("?");
      const query = Object.fromEntries(new URLSearchParams(search));
      _route = { path, query };
    } else {
      _route = { name: route };
    }
  }
  let localizedRoute = assign({}, _route);
  if (localizedRoute.path && !localizedRoute.name) {
    let _resolvedRoute = null;
    try {
      _resolvedRoute = resolve(router, localizedRoute, strategy, _locale);
    } catch {
    }
    const resolvedRoute = _resolvedRoute;
    const resolvedRouteName = getRouteBaseName.call(this, resolvedRoute);
    if (isString(resolvedRouteName)) {
      localizedRoute = {
        name: getLocaleRouteName(resolvedRouteName, _locale, {
          defaultLocale,
          strategy,
          routesNameSeparator,
          defaultLocaleRouteNameSuffix
        }),
        params: resolvedRoute.params,
        query: resolvedRoute.query,
        hash: resolvedRoute.hash
      };
      {
        localizedRoute.state = resolvedRoute.state;
      }
    } else {
      if (prefixable2({ currentLocale: _locale, defaultLocale, strategy })) {
        localizedRoute.path = `/${_locale}${localizedRoute.path}`;
      }
      localizedRoute.path = trailingSlash ? withTrailingSlash(localizedRoute.path, true) : withoutTrailingSlash(localizedRoute.path, true);
    }
  } else {
    if (!localizedRoute.name && !localizedRoute.path) {
      localizedRoute.name = getRouteBaseName.call(this, this.route);
    }
    localizedRoute.name = getLocaleRouteName(localizedRoute.name, _locale, {
      defaultLocale,
      strategy,
      routesNameSeparator,
      defaultLocaleRouteNameSuffix
    });
  }
  try {
    const resolvedRoute = router.resolve(localizedRoute);
    if (isVue3 ? resolvedRoute.name : resolvedRoute.route.name) {
      return resolvedRoute;
    }
    return router.resolve(route);
  } catch (e) {
    if (e.type === 1) {
      return null;
    }
  }
}
const DefaultSwitchLocalePathIntercepter = (path) => path;
function getLocalizableMetaFromDynamicParams(route, key) {
  const metaDefault = {};
  if (key === DEFAULT_DYNAMIC_PARAMS_KEY) {
    return metaDefault;
  }
  const meta = route.meta;
  if (isRef(meta)) {
    return meta.value[key] || metaDefault;
  } else {
    return meta[key] || metaDefault;
  }
}
function switchLocalePath(locale) {
  const route = this.route;
  const name = getRouteBaseName.call(this, route);
  if (!name) {
    return "";
  }
  const { switchLocalePathIntercepter, dynamicRouteParamsKey } = getI18nRoutingOptions(this.router, this);
  const routeValue = route;
  const routeCopy = routeToObject(routeValue);
  const langSwitchParams = getLocalizableMetaFromDynamicParams(route, dynamicRouteParamsKey)[locale] || {};
  const _baseRoute = {
    name,
    params: {
      ...routeCopy.params,
      ...langSwitchParams
    }
  };
  const baseRoute = assign({}, routeCopy, _baseRoute);
  let path = localePath.call(this, baseRoute, locale);
  path = switchLocalePathIntercepter(path, locale);
  return path;
}
function localeHead({ addDirAttribute = false, addSeoAttributes = false, identifierAttribute = "hid" } = {}) {
  const router = this.router;
  const i18n = this.i18n;
  const { defaultDirection } = getI18nRoutingOptions(router, this);
  const metaObject = {
    htmlAttrs: {},
    link: [],
    meta: []
  };
  if (i18n.locales == null || i18n.baseUrl == null) {
    return metaObject;
  }
  const locale = getLocale(i18n);
  const locales = getLocales(i18n);
  const currentLocale = getNormalizedLocales(locales).find((l) => l.code === locale) || {
    code: locale
  };
  const currentLocaleIso = currentLocale.iso;
  const currentLocaleDir = currentLocale.dir || defaultDirection;
  if (addDirAttribute) {
    metaObject.htmlAttrs.dir = currentLocaleDir;
  }
  if (addSeoAttributes && locale && i18n.locales) {
    if (currentLocaleIso) {
      metaObject.htmlAttrs.lang = currentLocaleIso;
    }
    addHreflangLinks.call(this, locales, unref(i18n.baseUrl), metaObject.link, identifierAttribute);
    addCanonicalLinksAndOgUrl.call(
      this,
      unref(i18n.baseUrl),
      metaObject.link,
      metaObject.meta,
      identifierAttribute,
      addSeoAttributes
    );
    addCurrentOgLocale(currentLocale, currentLocaleIso, metaObject.meta, identifierAttribute);
    addAlternateOgLocales(locales, currentLocaleIso, metaObject.meta, identifierAttribute);
  }
  return metaObject;
}
function addHreflangLinks(locales, baseUrl2, link, identifierAttribute) {
  const router = this.router;
  const { defaultLocale, strategy } = getI18nRoutingOptions(router, this);
  if (strategy === STRATEGIES.NO_PREFIX) {
    return;
  }
  const localeMap = /* @__PURE__ */ new Map();
  for (const locale of locales) {
    const localeIso = locale.iso;
    if (!localeIso) {
      warn("Locale ISO code is required to generate alternate link");
      continue;
    }
    const [language, region] = localeIso.split("-");
    if (language && region && (locale.isCatchallLocale || !localeMap.has(language))) {
      localeMap.set(language, locale);
    }
    localeMap.set(localeIso, locale);
  }
  for (const [iso, mapLocale] of localeMap.entries()) {
    const localePath2 = switchLocalePath.call(this, mapLocale.code);
    if (localePath2) {
      link.push({
        [identifierAttribute]: `i18n-alt-${iso}`,
        rel: "alternate",
        href: toAbsoluteUrl(localePath2, baseUrl2),
        hreflang: iso
      });
    }
  }
  if (defaultLocale) {
    const localePath2 = switchLocalePath.call(this, defaultLocale);
    if (localePath2) {
      link.push({
        [identifierAttribute]: "i18n-xd",
        rel: "alternate",
        href: toAbsoluteUrl(localePath2, baseUrl2),
        hreflang: "x-default"
      });
    }
  }
}
function addCanonicalLinksAndOgUrl(baseUrl2, link, meta, identifierAttribute, seoAttributesOptions) {
  const route = this.route;
  const currentRoute = localeRoute.call(this, {
    ...route,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    name: getRouteBaseName.call(this, route)
  });
  if (currentRoute) {
    let href = toAbsoluteUrl(currentRoute.path, baseUrl2);
    const canonicalQueries = isObject(seoAttributesOptions) && seoAttributesOptions.canonicalQueries || [];
    if (canonicalQueries.length) {
      const currentRouteQueryParams = currentRoute.query;
      const params = new URLSearchParams();
      for (const queryParamName of canonicalQueries) {
        if (queryParamName in currentRouteQueryParams) {
          const queryParamValue = currentRouteQueryParams[queryParamName];
          if (isArray(queryParamValue)) {
            queryParamValue.forEach((v) => params.append(queryParamName, v || ""));
          } else {
            params.append(queryParamName, queryParamValue || "");
          }
        }
      }
      const queryString = params.toString();
      if (queryString) {
        href = `${href}?${queryString}`;
      }
    }
    link.push({
      [identifierAttribute]: "i18n-can",
      rel: "canonical",
      href
    });
    meta.push({
      [identifierAttribute]: "i18n-og-url",
      property: "og:url",
      content: href
    });
  }
}
function addCurrentOgLocale(currentLocale, currentLocaleIso, meta, identifierAttribute) {
  const hasCurrentLocaleAndIso = currentLocale && currentLocaleIso;
  if (!hasCurrentLocaleAndIso) {
    return;
  }
  meta.push({
    [identifierAttribute]: "i18n-og",
    property: "og:locale",
    // Replace dash with underscore as defined in spec: language_TERRITORY
    content: hypenToUnderscore(currentLocaleIso)
  });
}
function addAlternateOgLocales(locales, currentLocaleIso, meta, identifierAttribute) {
  const localesWithoutCurrent = locales.filter((locale) => {
    const localeIso = locale.iso;
    return localeIso && localeIso !== currentLocaleIso;
  });
  if (localesWithoutCurrent.length) {
    const alternateLocales = localesWithoutCurrent.map((locale) => ({
      [identifierAttribute]: `i18n-og-alt-${locale.iso}`,
      property: "og:locale:alternate",
      content: hypenToUnderscore(locale.iso)
    }));
    meta.push(...alternateLocales);
  }
}
function hypenToUnderscore(str) {
  return (str || "").replace(/-/g, "_");
}
function toAbsoluteUrl(urlOrPath, baseUrl2) {
  if (urlOrPath.match(/^https?:\/\//)) {
    return urlOrPath;
  }
  return baseUrl2 + urlOrPath;
}
function proxyForComposable(options, target) {
  const {
    router,
    route,
    i18n,
    defaultLocale,
    strategy,
    defaultLocaleRouteNameSuffix,
    trailingSlash,
    routesNameSeparator
  } = options;
  return function(...args) {
    return Reflect.apply(
      target,
      {
        router,
        route,
        i18n,
        defaultLocale,
        strategy,
        defaultLocaleRouteNameSuffix,
        trailingSlash,
        routesNameSeparator
      },
      args
    );
  };
}
function useSwitchLocalePath({
  router = useRouter$1(),
  route = useRoute$1(),
  i18n = useI18n(),
  defaultLocale = void 0,
  defaultLocaleRouteNameSuffix = void 0,
  routesNameSeparator = void 0,
  strategy = void 0,
  trailingSlash = void 0
} = {}) {
  return proxyForComposable(
    {
      router,
      route,
      i18n,
      defaultLocale,
      defaultLocaleRouteNameSuffix,
      routesNameSeparator,
      strategy,
      trailingSlash
    },
    switchLocalePath
  );
}
const localeCodes = [
  "en",
  "es",
  "pt"
];
const localeMessages = {
  "en": [],
  "es": [],
  "pt": []
};
const resolveNuxtI18nOptions = async (context) => {
  const nuxtI18nOptions = {
    "experimental": {
      "jsTsFormatResource": false
    },
    "bundle": {
      "compositionOnly": true,
      "runtimeOnly": false,
      "fullInstall": true,
      "dropMessageCompiler": false
    },
    "compilation": {
      "jit": true,
      "strictMessage": true,
      "escapeHtml": false
    },
    "customBlocks": {
      "defaultSFCLang": "json",
      "globalSFCScope": false
    },
    "vueI18n": "./i18n.config.ts",
    "locales": [
      "en",
      "es",
      "pt"
    ],
    "defaultLocale": "en",
    "defaultDirection": "ltr",
    "routesNameSeparator": "___",
    "trailingSlash": false,
    "defaultLocaleRouteNameSuffix": "default",
    "strategy": "prefix_except_default",
    "lazy": false,
    "langDir": null,
    "rootRedirect": null,
    "detectBrowserLanguage": false,
    "differentDomains": false,
    "baseUrl": "",
    "dynamicRouteParams": false,
    "customRoutes": "page",
    "pages": {},
    "skipSettingLocaleOnNavigate": false,
    "types": "composition",
    "debug": false,
    "parallelPlugin": false,
    "i18nModules": []
  };
  const vueI18nConfigLoader = async (loader) => {
    const config2 = await loader().then((r) => r.default || r);
    if (typeof config2 === "object")
      return config2;
    if (typeof config2 === "function")
      return await config2();
    return {};
  };
  const deepCopy2 = (src, des, predicate) => {
    for (const key in src) {
      if (typeof src[key] === "object") {
        if (!(typeof des[key] === "object"))
          des[key] = {};
        deepCopy2(src[key], des[key], predicate);
      } else {
        if (predicate) {
          if (predicate(src[key], des[key])) {
            des[key] = src[key];
          }
        } else {
          des[key] = src[key];
        }
      }
    }
  };
  const mergeVueI18nConfigs = async (loader) => {
    var _a, _b;
    const layerConfig = await vueI18nConfigLoader(loader);
    const cfg = layerConfig || {};
    for (const [k, v] of Object.entries(cfg)) {
      if (((_a = nuxtI18nOptions.vueI18n) == null ? void 0 : _a[k]) === void 0 || typeof ((_b = nuxtI18nOptions.vueI18n) == null ? void 0 : _b[k]) !== "object") {
        nuxtI18nOptions.vueI18n[k] = v;
      } else {
        deepCopy2(v, nuxtI18nOptions.vueI18n[k]);
      }
    }
  };
  nuxtI18nOptions.vueI18n = { messages: {} };
  await mergeVueI18nConfigs(() => import(
    "./_nuxt/i18n.config-5c195672.js"
    /* webpackChunkName: __i18n_config_ts_bffaebcb */
  ));
  return nuxtI18nOptions;
};
const nuxtI18nOptionsDefault = {
  "experimental": {
    "jsTsFormatResource": false
  },
  "bundle": {
    "compositionOnly": true,
    "runtimeOnly": false,
    "fullInstall": true,
    "dropMessageCompiler": false
  },
  "compilation": {
    "jit": true,
    "strictMessage": true,
    "escapeHtml": false
  },
  "customBlocks": {
    "defaultSFCLang": "json",
    "globalSFCScope": false
  },
  "vueI18n": "",
  "locales": [],
  "defaultLocale": "",
  "defaultDirection": "ltr",
  "routesNameSeparator": "___",
  "trailingSlash": false,
  "defaultLocaleRouteNameSuffix": "default",
  "strategy": "prefix_except_default",
  "lazy": false,
  "langDir": null,
  "rootRedirect": null,
  "detectBrowserLanguage": {
    "alwaysRedirect": false,
    "cookieCrossOrigin": false,
    "cookieDomain": null,
    "cookieKey": "i18n_redirected",
    "cookieSecure": false,
    "fallbackLocale": "",
    "redirectOn": "root",
    "useCookie": true
  },
  "differentDomains": false,
  "baseUrl": "",
  "dynamicRouteParams": false,
  "customRoutes": "page",
  "pages": {},
  "skipSettingLocaleOnNavigate": false,
  "types": "composition",
  "debug": false,
  "parallelPlugin": false
};
const nuxtI18nInternalOptions = {
  "__normalizedLocales": [
    {
      "iso": "en",
      "code": "en"
    },
    {
      "iso": "es",
      "code": "es"
    },
    {
      "iso": "pt",
      "code": "pt"
    }
  ]
};
const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n";
const parallelPlugin = false;
const isSSG = false;
function formatMessage(message) {
  return NUXT_I18N_MODULE_ID + " " + message;
}
function isLegacyVueI18n(target) {
  return target != null && ("__VUE_I18N_BRIDGE__" in target || "_sync" in target);
}
function callVueI18nInterfaces(i18n, name, ...args) {
  const target = isI18nInstance(i18n) ? i18n.global : i18n;
  const [obj, method] = [target, target[name]];
  return Reflect.apply(method, obj, [...args]);
}
function getVueI18nPropertyValue(i18n, name) {
  const target = isI18nInstance(i18n) ? i18n.global : i18n;
  const ret = isComposer(target) ? target[name].value : isExportedGlobalComposer(target) || isVueI18n(target) || isLegacyVueI18n(target) ? target[name] : target[name];
  return ret;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
function proxyNuxt(nuxt, target) {
  return function() {
    return Reflect.apply(
      target,
      {
        i18n: nuxt.$i18n,
        getRouteBaseName: nuxt.$getRouteBaseName,
        localePath: nuxt.$localePath,
        localeRoute: nuxt.$localeRoute,
        switchLocalePath: nuxt.$switchLocalePath,
        localeHead: nuxt.$localeHead,
        route: nuxt.$router.currentRoute.value,
        router: nuxt.$router
      },
      // eslint-disable-next-line prefer-rest-params
      arguments
    );
  };
}
function parseAcceptLanguage(input) {
  return input.split(",").map((tag) => tag.split(";")[0]);
}
function deepCopy(src, des, predicate) {
  for (const key in src) {
    if (isArray$1(src[key])) {
      if (!isArray$1(des[key])) {
        des[key] = [];
      }
      src[key].forEach((item, index) => {
        if (!des[key][index]) {
          const desItem = {};
          deepCopy(item, desItem, predicate);
          des[key].push(desItem);
        }
      });
    } else if (isObject$1(src[key])) {
      if (!isObject$1(des[key])) {
        des[key] = {};
      }
      deepCopy(src[key], des[key], predicate);
    } else {
      if (predicate) {
        if (predicate(src[key], des[key])) {
          des[key] = src[key];
        }
      } else {
        des[key] = src[key];
      }
    }
  }
}
const loadedMessages = /* @__PURE__ */ new Map();
async function loadMessage(context, { key, load }, locale) {
  var _a, _b;
  const i18nConfig = (_a = context.$config.public) == null ? void 0 : _a.i18n;
  let message = null;
  try {
    const getter = await load().then((r) => r.default || r);
    if (isFunction$1(getter)) {
      if ((_b = i18nConfig.experimental) == null ? void 0 : _b.jsTsFormatResource) {
        message = await getter(locale);
      } else {
        console.warn(
          formatMessage(
            "JS / TS extension format is not supported by default. This can be enabled by setting `i18n.experimental.jsTsFormatResource: true` (experimental)"
          )
        );
      }
    } else {
      message = getter;
      if (message != null) {
        loadedMessages.set(key, message);
      }
    }
  } catch (e) {
    console.error(formatMessage("Failed locale loading: " + e.message));
  }
  return message;
}
async function loadLocale(context, locale, setter) {
  const loaders = localeMessages[locale];
  if (loaders == null) {
    console.warn(formatMessage("Could not find messages for locale code" + locale));
    return;
  }
  const targetMessage = {};
  for (const loader of loaders) {
    let message = null;
    if (loadedMessages.has(loader.key) && loader.cache) {
      message = loadedMessages.get(loader.key);
    } else {
      message = await loadMessage(context, loader, locale);
    }
    if (message != null) {
      deepCopy(message, targetMessage);
    }
  }
  setter(locale, targetMessage);
}
function getBrowserLocale(options, context) {
  let ret;
  {
    const header = useRequestHeaders(["accept-language"]);
    const accept = header["accept-language"];
    if (accept) {
      ret = findBrowserLocale(options.__normalizedLocales, parseAcceptLanguage(accept));
    }
  }
  return ret;
}
function getLocaleCookie(context, {
  useCookie = nuxtI18nOptionsDefault.detectBrowserLanguage.useCookie,
  cookieKey = nuxtI18nOptionsDefault.detectBrowserLanguage.cookieKey,
  localeCodes: localeCodes2 = []
} = {}) {
  if (useCookie) {
    let localeCode;
    {
      const cookie = useRequestHeaders(["cookie"]);
      if ("cookie" in cookie) {
        const parsedCookie = parse$1(cookie["cookie"]);
        localeCode = parsedCookie[cookieKey];
      }
    }
    if (localeCode && localeCodes2.includes(localeCode)) {
      return localeCode;
    }
  }
}
function setLocaleCookie(locale, context, {
  useCookie = nuxtI18nOptionsDefault.detectBrowserLanguage.useCookie,
  cookieKey = nuxtI18nOptionsDefault.detectBrowserLanguage.cookieKey,
  cookieDomain = nuxtI18nOptionsDefault.detectBrowserLanguage.cookieDomain,
  cookieSecure = nuxtI18nOptionsDefault.detectBrowserLanguage.cookieSecure,
  cookieCrossOrigin = nuxtI18nOptionsDefault.detectBrowserLanguage.cookieCrossOrigin
} = {}) {
  if (!useCookie) {
    return;
  }
  const date = /* @__PURE__ */ new Date();
  const cookieOptions = {
    expires: new Date(date.setDate(date.getDate() + 365)),
    path: "/",
    sameSite: cookieCrossOrigin ? "none" : "lax",
    secure: cookieCrossOrigin || cookieSecure
  };
  if (cookieDomain) {
    cookieOptions.domain = cookieDomain;
  }
  {
    if (context.res) {
      const { res } = context;
      let headers = res.getHeader("Set-Cookie") || [];
      if (!isArray$1(headers)) {
        headers = [String(headers)];
      }
      const redirectCookie = serialize(cookieKey, locale, cookieOptions);
      headers.push(redirectCookie);
      res.setHeader("Set-Cookie", headers);
    }
  }
}
const DefaultDetectBrowserLanguageFromResult = {
  locale: "",
  stat: false,
  reason: "unknown",
  from: "unknown"
};
function detectBrowserLanguage(route, context, nuxtI18nOptions, nuxtI18nInternalOptions2, detectLocaleContext, localeCodes2 = [], locale = "") {
  const { strategy } = nuxtI18nOptions;
  const { ssg, callType, firstAccess } = detectLocaleContext;
  if (!firstAccess) {
    return { locale: "", stat: false, reason: "first_access_only" };
  }
  const { redirectOn, alwaysRedirect, useCookie, fallbackLocale } = nuxtI18nOptions.detectBrowserLanguage;
  const path = isString$1(route) ? route : route.path;
  if (strategy !== "no_prefix") {
    if (redirectOn === "root") {
      if (path !== "/") {
        return { locale: "", stat: false, reason: "not_redirect_on_root" };
      }
    } else if (redirectOn === "no prefix") {
      if (!alwaysRedirect && path.match(getLocalesRegex(localeCodes2))) {
        return { locale: "", stat: false, reason: "not_redirect_on_no_prefix" };
      }
    }
  }
  let localeFrom = "unknown";
  let cookieLocale;
  let matchedLocale;
  if (useCookie) {
    matchedLocale = cookieLocale = getLocaleCookie(context, { ...nuxtI18nOptions.detectBrowserLanguage, localeCodes: localeCodes2 });
    localeFrom = "cookie";
  }
  if (!matchedLocale) {
    matchedLocale = getBrowserLocale(nuxtI18nInternalOptions2);
    localeFrom = "navigator_or_header";
  }
  const finalLocale = matchedLocale || fallbackLocale;
  if (!matchedLocale && fallbackLocale) {
    localeFrom = "fallback";
  }
  const vueI18nLocale = locale || nuxtI18nOptions.vueI18n.locale;
  if (finalLocale && (!useCookie || alwaysRedirect || !cookieLocale)) {
    if (strategy === "no_prefix") {
      return { locale: finalLocale, stat: true, from: localeFrom };
    } else {
      if (callType === "setup") {
        if (finalLocale !== vueI18nLocale) {
          return { locale: finalLocale, stat: true, from: localeFrom };
        }
      }
      if (alwaysRedirect) {
        const redirectOnRoot = path === "/";
        const redirectOnAll = redirectOn === "all";
        const redirectOnNoPrefix = redirectOn === "no prefix" && !path.match(getLocalesRegex(localeCodes2));
        if (redirectOnRoot || redirectOnAll || redirectOnNoPrefix) {
          return { locale: finalLocale, stat: true, from: localeFrom };
        }
      }
    }
  }
  if (ssg === "ssg_setup" && finalLocale) {
    return { locale: finalLocale, stat: true, from: localeFrom };
  }
  if ((localeFrom === "navigator_or_header" || localeFrom === "cookie") && finalLocale) {
    return { locale: finalLocale, stat: true, from: localeFrom };
  }
  return { locale: "", stat: false, reason: "not_found_match" };
}
function getHost() {
  let host;
  {
    const header = useRequestHeaders(["x-forwarded-host", "host"]);
    let detectedHost;
    if ("x-forwarded-host" in header) {
      detectedHost = header["x-forwarded-host"];
    } else if ("host" in header) {
      detectedHost = header["host"];
    }
    host = isArray$1(detectedHost) ? detectedHost[0] : detectedHost;
  }
  return host;
}
function getLocaleDomain(locales) {
  let host = getHost() || "";
  if (host) {
    const matchingLocale = locales.find((locale) => {
      if (locale && locale.domain) {
        let domain = locale.domain;
        if (hasProtocol(locale.domain)) {
          domain = locale.domain.replace(/(http|https):\/\//, "");
        }
        return domain === host;
      }
      return false;
    });
    if (matchingLocale) {
      return matchingLocale.code;
    } else {
      host = "";
    }
  }
  return host;
}
function getDomainFromLocale(localeCode, locales, nuxt) {
  var _a, _b;
  const config2 = nuxt == null ? void 0 : nuxt.$config.public.i18n;
  const lang = locales.find((locale) => locale.code === localeCode);
  const domain = ((_b = (_a = config2 == null ? void 0 : config2.locales) == null ? void 0 : _a[localeCode]) == null ? void 0 : _b.domain) ?? (lang == null ? void 0 : lang.domain);
  if (domain) {
    if (hasProtocol(domain, { strict: true })) {
      return domain;
    }
    let protocol;
    {
      const {
        node: { req }
      } = useRequestEvent(nuxt);
      protocol = req && isHTTPS(req) ? "https:" : "http:";
    }
    return protocol + "//" + domain;
  }
  console.warn(formatMessage("Could not find domain name for locale " + localeCode));
}
function setCookieLocale(i18n, locale) {
  return callVueI18nInterfaces(i18n, "setLocaleCookie", locale);
}
function mergeLocaleMessage(i18n, locale, messages) {
  return callVueI18nInterfaces(i18n, "mergeLocaleMessage", locale, messages);
}
function onBeforeLanguageSwitch(i18n, oldLocale, newLocale, initial, context) {
  return callVueI18nInterfaces(i18n, "onBeforeLanguageSwitch", oldLocale, newLocale, initial, context);
}
function onLanguageSwitched(i18n, oldLocale, newLocale) {
  return callVueI18nInterfaces(i18n, "onLanguageSwitched", oldLocale, newLocale);
}
function makeFallbackLocaleCodes(fallback, locales) {
  let fallbackLocales = [];
  if (isArray$1(fallback)) {
    fallbackLocales = fallback;
  } else if (isObject$1(fallback)) {
    const targets = [...locales, "default"];
    for (const locale of targets) {
      if (fallback[locale]) {
        fallbackLocales = [...fallbackLocales, ...fallback[locale].filter(Boolean)];
      }
    }
  } else if (isString$1(fallback) && locales.every((locale) => locale !== fallback)) {
    fallbackLocales.push(fallback);
  }
  return fallbackLocales;
}
async function loadInitialMessages(context, messages, options) {
  const { defaultLocale, initialLocale, localeCodes: localeCodes2, fallbackLocale, lazy } = options;
  const setter = (locale, message) => {
    const base = messages[locale] || {};
    messages[locale] = { ...base, ...message };
  };
  if (lazy && fallbackLocale) {
    const fallbackLocales = makeFallbackLocaleCodes(fallbackLocale, [defaultLocale, initialLocale]);
    await Promise.all(fallbackLocales.map((locale) => loadLocale(context, locale, setter)));
  }
  const locales = lazy ? [...(/* @__PURE__ */ new Set()).add(defaultLocale).add(initialLocale)] : localeCodes2;
  await Promise.all(locales.map((locale) => loadLocale(context, locale, setter)));
  return messages;
}
async function loadAndSetLocale(newLocale, context, i18n, {
  useCookie = nuxtI18nOptionsDefault.detectBrowserLanguage.useCookie,
  skipSettingLocaleOnNavigate = nuxtI18nOptionsDefault.skipSettingLocaleOnNavigate,
  differentDomains = nuxtI18nOptionsDefault.differentDomains,
  initial = false,
  lazy = false
} = {}) {
  let ret = false;
  const oldLocale = getLocale(i18n);
  if (!newLocale) {
    return [ret, oldLocale];
  }
  if (!initial && differentDomains) {
    return [ret, oldLocale];
  }
  if (oldLocale === newLocale) {
    return [ret, oldLocale];
  }
  const localeOverride = await onBeforeLanguageSwitch(i18n, oldLocale, newLocale, initial, context);
  const localeCodes2 = getLocaleCodes(i18n);
  if (localeOverride && localeCodes2 && localeCodes2.includes(localeOverride)) {
    if (localeOverride === oldLocale) {
      return [ret, oldLocale];
    }
    newLocale = localeOverride;
  }
  const i18nFallbackLocales = getVueI18nPropertyValue(i18n, "fallbackLocale");
  if (lazy) {
    const setter = (locale, message) => mergeLocaleMessage(i18n, locale, message);
    if (i18nFallbackLocales) {
      const fallbackLocales = makeFallbackLocaleCodes(i18nFallbackLocales, [newLocale]);
      await Promise.all(fallbackLocales.map((locale) => loadLocale(context, locale, setter)));
    }
    await loadLocale(context, newLocale, setter);
  }
  if (skipSettingLocaleOnNavigate) {
    return [ret, oldLocale];
  }
  if (useCookie) {
    setCookieLocale(i18n, newLocale);
  }
  setLocale(i18n, newLocale);
  await onLanguageSwitched(i18n, oldLocale, newLocale);
  ret = true;
  return [ret, oldLocale];
}
function detectLocale(route, context, routeLocaleGetter, nuxtI18nOptions, initialLocaleLoader, detectLocaleContext, normalizedLocales, localeCodes2 = []) {
  const { strategy, defaultLocale, differentDomains } = nuxtI18nOptions;
  const initialLocale = isFunction$1(initialLocaleLoader) ? initialLocaleLoader() : initialLocaleLoader;
  const { locale: browserLocale, stat, reason, from } = nuxtI18nOptions.detectBrowserLanguage ? detectBrowserLanguage(route, context, nuxtI18nOptions, nuxtI18nInternalOptions, detectLocaleContext, localeCodes2, initialLocale) : DefaultDetectBrowserLanguageFromResult;
  if (reason === "detect_ignore_on_ssg") {
    return initialLocale;
  }
  if ((from === "navigator_or_header" || from === "cookie" || from === "fallback") && browserLocale) {
    return browserLocale;
  }
  let finalLocale = browserLocale;
  if (!finalLocale) {
    if (differentDomains) {
      finalLocale = getLocaleDomain(normalizedLocales);
    } else if (strategy !== "no_prefix") {
      finalLocale = routeLocaleGetter(route);
    } else {
      if (!nuxtI18nOptions.detectBrowserLanguage) {
        finalLocale = initialLocale;
      }
    }
  }
  if (!finalLocale && nuxtI18nOptions.detectBrowserLanguage && nuxtI18nOptions.detectBrowserLanguage.useCookie) {
    finalLocale = getLocaleCookie(context, { ...nuxtI18nOptions.detectBrowserLanguage, localeCodes: localeCodes2 }) || "";
  }
  if (!finalLocale) {
    finalLocale = defaultLocale || "";
  }
  return finalLocale;
}
function detectRedirect({
  route,
  context,
  targetLocale,
  routeLocaleGetter,
  nuxtI18nOptions,
  calledWithRouting = false
}) {
  const { strategy, differentDomains } = nuxtI18nOptions;
  let redirectPath = "";
  const { fullPath: toFullPath } = route.to;
  if (!differentDomains && (calledWithRouting || strategy !== "no_prefix" && strategy !== "prefix_and_default") && routeLocaleGetter(route.to) !== targetLocale) {
    const routePath = context.$switchLocalePath(targetLocale) || context.$localePath(toFullPath, targetLocale);
    if (isString$1(routePath) && routePath && !isEqual(routePath, toFullPath) && !routePath.startsWith("//")) {
      redirectPath = !(route.from && route.from.fullPath === routePath) ? routePath : "";
    }
  }
  if ((differentDomains || isSSG) && routeLocaleGetter(route.to) !== targetLocale) {
    const switchLocalePath2 = useSwitchLocalePath({
      i18n: getComposer(context.$i18n),
      route: route.to,
      router: context.$router
    });
    const routePath = switchLocalePath2(targetLocale);
    if (isString$1(routePath) && routePath && !isEqual(routePath, toFullPath) && !routePath.startsWith("//")) {
      redirectPath = routePath;
    }
  }
  return redirectPath;
}
function isRootRedirectOptions(rootRedirect) {
  return isObject$1(rootRedirect) && "path" in rootRedirect && "statusCode" in rootRedirect;
}
const useRedirectState = () => useState(NUXT_I18N_MODULE_ID + ":redirect", () => "");
function _navigate(redirectPath, status) {
  return navigateTo(redirectPath, { redirectCode: status });
}
async function navigate(args, {
  status = 302,
  rootRedirect = nuxtI18nOptionsDefault.rootRedirect,
  differentDomains = nuxtI18nOptionsDefault.differentDomains,
  skipSettingLocaleOnNavigate = nuxtI18nOptionsDefault.skipSettingLocaleOnNavigate,
  enableNavigate = false
} = {}) {
  const { i18n, locale, route } = args;
  let { redirectPath } = args;
  if (route.path === "/" && rootRedirect) {
    if (isString$1(rootRedirect)) {
      redirectPath = "/" + rootRedirect;
    } else if (isRootRedirectOptions(rootRedirect)) {
      redirectPath = "/" + rootRedirect.path;
      status = rootRedirect.statusCode;
    }
    return _navigate(redirectPath, status);
  }
  if (!differentDomains) {
    if (redirectPath) {
      return _navigate(redirectPath, status);
    }
  } else {
    const state = useRedirectState();
    if (state.value && state.value !== redirectPath) {
      {
        state.value = redirectPath;
      }
    }
  }
}
function injectNuxtHelpers(nuxt, i18n) {
  defineGetter(nuxt, "$i18n", i18n.global);
  for (const pair of [
    ["getRouteBaseName", getRouteBaseName],
    ["localePath", localePath],
    ["localeRoute", localeRoute],
    ["switchLocalePath", switchLocalePath],
    ["localeHead", localeHead]
  ]) {
    defineGetter(nuxt, "$" + pair[0], proxyNuxt(nuxt, pair[1]));
  }
}
function extendPrefixable(differentDomains) {
  return (opts) => {
    return DefaultPrefixable(opts) && !differentDomains;
  };
}
function extendSwitchLocalePathIntercepter(differentDomains, normalizedLocales, nuxt) {
  return (path, locale) => {
    if (differentDomains) {
      const domain = getDomainFromLocale(locale, normalizedLocales, nuxt);
      if (domain) {
        return joinURL(domain, path);
      } else {
        return path;
      }
    } else {
      return DefaultSwitchLocalePathIntercepter(path);
    }
  };
}
function extendBaseUrl(baseUrl2, options) {
  return (context) => {
    var _a, _b;
    if (isFunction$1(baseUrl2)) {
      const baseUrlResult = baseUrl2(context);
      return baseUrlResult;
    }
    const { differentDomains, localeCodeLoader, normalizedLocales } = options;
    const localeCode = isFunction$1(localeCodeLoader) ? localeCodeLoader() : localeCodeLoader;
    if (differentDomains && localeCode) {
      const domain = getDomainFromLocale(localeCode, normalizedLocales, options.nuxt);
      if (domain) {
        return domain;
      }
    }
    const config2 = (_b = (_a = context.$config) == null ? void 0 : _a.public) == null ? void 0 : _b.i18n;
    if (config2 == null ? void 0 : config2.baseUrl) {
      return config2.baseUrl;
    }
    return baseUrl2;
  };
}
const i18n_yfWm7jX06p = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin",
  parallel: parallelPlugin,
  async setup(nuxt) {
    let __temp, __restore;
    const router = useRouter();
    const route = useRoute();
    const { vueApp: app } = nuxt;
    const nuxtContext = nuxt;
    const nuxtI18nOptions = ([__temp, __restore] = executeAsync(() => resolveNuxtI18nOptions()), __temp = await __temp, __restore(), __temp);
    const useCookie = nuxtI18nOptions.detectBrowserLanguage && nuxtI18nOptions.detectBrowserLanguage.useCookie;
    const { __normalizedLocales: normalizedLocales } = nuxtI18nInternalOptions;
    const {
      defaultLocale,
      differentDomains,
      skipSettingLocaleOnNavigate,
      lazy,
      routesNameSeparator,
      defaultLocaleRouteNameSuffix,
      strategy,
      rootRedirect
    } = nuxtI18nOptions;
    nuxtI18nOptions.baseUrl = extendBaseUrl(nuxtI18nOptions.baseUrl, {
      differentDomains,
      nuxt: nuxtContext,
      localeCodeLoader: defaultLocale,
      normalizedLocales
    });
    const getLocaleFromRoute = createLocaleFromRouteGetter(
      localeCodes,
      routesNameSeparator,
      defaultLocaleRouteNameSuffix
    );
    const vueI18nOptions = nuxtI18nOptions.vueI18n;
    vueI18nOptions.messages = vueI18nOptions.messages || {};
    vueI18nOptions.fallbackLocale = vueI18nOptions.fallbackLocale ?? false;
    registerGlobalOptions(router, {
      ...nuxtI18nOptions,
      dynamicRouteParamsKey: "nuxtI18n",
      switchLocalePathIntercepter: extendSwitchLocalePathIntercepter(differentDomains, normalizedLocales, nuxtContext),
      prefixable: extendPrefixable(differentDomains)
    });
    const getDefaultLocale = (defaultLocale2) => defaultLocale2 || vueI18nOptions.locale || "en-US";
    let initialLocale = detectLocale(
      route,
      nuxt.ssrContext,
      getLocaleFromRoute,
      nuxtI18nOptions,
      getDefaultLocale(defaultLocale),
      { ssg: "normal", callType: "setup", firstAccess: true },
      normalizedLocales,
      localeCodes
    );
    vueI18nOptions.messages = ([__temp, __restore] = executeAsync(() => loadInitialMessages(nuxtContext, vueI18nOptions.messages, {
      ...nuxtI18nOptions,
      initialLocale,
      fallbackLocale: vueI18nOptions.fallbackLocale,
      localeCodes
    })), __temp = await __temp, __restore(), __temp);
    initialLocale = getDefaultLocale(initialLocale);
    const i18n = createI18n({
      ...vueI18nOptions,
      locale: initialLocale
    });
    let notInitialSetup = true;
    const isInitialLocaleSetup = (locale) => initialLocale !== locale && notInitialSetup;
    extendI18n(i18n, {
      locales: nuxtI18nOptions.locales,
      localeCodes,
      baseUrl: nuxtI18nOptions.baseUrl,
      context: nuxtContext,
      hooks: {
        onExtendComposer(composer) {
          composer.strategy = strategy;
          composer.localeProperties = computed(() => {
            return normalizedLocales.find((l) => l.code === composer.locale.value) || {
              code: composer.locale.value
            };
          });
          composer.setLocale = async (locale) => {
            const localeSetup = isInitialLocaleSetup(locale);
            const [modified] = await loadAndSetLocale(locale, nuxtContext, i18n, {
              useCookie,
              differentDomains,
              initial: localeSetup,
              skipSettingLocaleOnNavigate,
              lazy
            });
            if (modified && localeSetup) {
              notInitialSetup = false;
            }
            const redirectPath = detectRedirect({
              route: { to: route },
              context: nuxtContext,
              targetLocale: locale,
              routeLocaleGetter: getLocaleFromRoute,
              nuxtI18nOptions
            });
            await navigate(
              {
                i18n,
                redirectPath,
                locale,
                route
              },
              {
                differentDomains,
                skipSettingLocaleOnNavigate,
                rootRedirect,
                enableNavigate: true
              }
            );
          };
          composer.differentDomains = differentDomains;
          composer.defaultLocale = defaultLocale;
          composer.getBrowserLocale = () => getBrowserLocale(nuxtI18nInternalOptions, nuxt.ssrContext);
          composer.getLocaleCookie = () => getLocaleCookie(nuxt.ssrContext, { ...nuxtI18nOptions.detectBrowserLanguage, localeCodes });
          composer.setLocaleCookie = (locale) => setLocaleCookie(locale, nuxt.ssrContext, nuxtI18nOptions.detectBrowserLanguage || void 0);
          composer.onBeforeLanguageSwitch = (oldLocale, newLocale, initialSetup, context) => nuxt.callHook("i18n:beforeLocaleSwitch", { oldLocale, newLocale, initialSetup, context });
          composer.onLanguageSwitched = (oldLocale, newLocale) => nuxt.callHook("i18n:localeSwitched", { oldLocale, newLocale });
          composer.finalizePendingLocaleChange = async () => {
            if (!i18n.__pendingLocale) {
              return;
            }
            setLocale(i18n, i18n.__pendingLocale);
            if (i18n.__resolvePendingLocalePromise) {
              await i18n.__resolvePendingLocalePromise();
            }
            i18n.__pendingLocale = void 0;
          };
          composer.waitForPendingLocaleChange = async () => {
            if (i18n.__pendingLocale && i18n.__pendingLocalePromise) {
              await i18n.__pendingLocalePromise;
            }
          };
        },
        onExtendExportedGlobal(g) {
          return {
            strategy: {
              get() {
                return g.strategy;
              }
            },
            localeProperties: {
              get() {
                return g.localeProperties.value;
              }
            },
            setLocale: {
              get() {
                return async (locale) => Reflect.apply(g.setLocale, g, [locale]);
              }
            },
            differentDomains: {
              get() {
                return g.differentDomains;
              }
            },
            defaultLocale: {
              get() {
                return g.defaultLocale;
              }
            },
            getBrowserLocale: {
              get() {
                return () => Reflect.apply(g.getBrowserLocale, g, []);
              }
            },
            getLocaleCookie: {
              get() {
                return () => Reflect.apply(g.getLocaleCookie, g, []);
              }
            },
            setLocaleCookie: {
              get() {
                return (locale) => Reflect.apply(g.setLocaleCookie, g, [locale]);
              }
            },
            onBeforeLanguageSwitch: {
              get() {
                return (oldLocale, newLocale, initialSetup, context) => Reflect.apply(g.onBeforeLanguageSwitch, g, [oldLocale, newLocale, initialSetup, context]);
              }
            },
            onLanguageSwitched: {
              get() {
                return (oldLocale, newLocale) => Reflect.apply(g.onLanguageSwitched, g, [oldLocale, newLocale]);
              }
            },
            finalizePendingLocaleChange: {
              get() {
                return () => Reflect.apply(g.finalizePendingLocaleChange, g, []);
              }
            },
            waitForPendingLocaleChange: {
              get() {
                return () => Reflect.apply(g.waitForPendingLocaleChange, g, []);
              }
            }
          };
        },
        onExtendVueI18n(composer) {
          return {
            strategy: {
              get() {
                return composer.strategy;
              }
            },
            localeProperties: {
              get() {
                return composer.localeProperties.value;
              }
            },
            setLocale: {
              get() {
                return async (locale) => Reflect.apply(composer.setLocale, composer, [locale]);
              }
            },
            differentDomains: {
              get() {
                return composer.differentDomains;
              }
            },
            defaultLocale: {
              get() {
                return composer.defaultLocale;
              }
            },
            getBrowserLocale: {
              get() {
                return () => Reflect.apply(composer.getBrowserLocale, composer, []);
              }
            },
            getLocaleCookie: {
              get() {
                return () => Reflect.apply(composer.getLocaleCookie, composer, []);
              }
            },
            setLocaleCookie: {
              get() {
                return (locale) => Reflect.apply(composer.setLocaleCookie, composer, [locale]);
              }
            },
            onBeforeLanguageSwitch: {
              get() {
                return (oldLocale, newLocale, initialSetup, context) => Reflect.apply(composer.onBeforeLanguageSwitch, composer, [
                  oldLocale,
                  newLocale,
                  initialSetup,
                  context
                ]);
              }
            },
            onLanguageSwitched: {
              get() {
                return (oldLocale, newLocale) => Reflect.apply(composer.onLanguageSwitched, composer, [oldLocale, newLocale]);
              }
            },
            finalizePendingLocaleChange: {
              get() {
                return () => Reflect.apply(composer.finalizePendingLocaleChange, composer, []);
              }
            },
            waitForPendingLocaleChange: {
              get() {
                return () => Reflect.apply(composer.waitForPendingLocaleChange, composer, []);
              }
            }
          };
        }
      }
    });
    const pluginOptions = {
      __composerExtend: (c) => {
        const g = getComposer(i18n);
        c.strategy = g.strategy;
        c.localeProperties = computed(() => g.localeProperties.value);
        c.setLocale = g.setLocale;
        c.differentDomains = g.differentDomains;
        c.getBrowserLocale = g.getBrowserLocale;
        c.getLocaleCookie = g.getLocaleCookie;
        c.setLocaleCookie = g.setLocaleCookie;
        c.onBeforeLanguageSwitch = g.onBeforeLanguageSwitch;
        c.onLanguageSwitched = g.onLanguageSwitched;
        c.finalizePendingLocaleChange = g.finalizePendingLocaleChange;
        c.waitForPendingLocaleChange = g.waitForPendingLocaleChange;
        return () => {
        };
      }
    };
    app.use(i18n, pluginOptions);
    injectNuxtHelpers(nuxtContext, i18n);
    let routeChangeCount = 0;
    addRouteMiddleware(
      "locale-changing",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
        let __temp2, __restore2;
        const locale = detectLocale(
          to,
          nuxt.ssrContext,
          getLocaleFromRoute,
          nuxtI18nOptions,
          () => {
            return getLocale(i18n) || getDefaultLocale(defaultLocale);
          },
          {
            ssg: "normal",
            callType: "routing",
            firstAccess: routeChangeCount === 0
          },
          normalizedLocales,
          localeCodes
        );
        const localeSetup = isInitialLocaleSetup(locale);
        const [modified] = ([__temp2, __restore2] = executeAsync(() => loadAndSetLocale(locale, nuxtContext, i18n, {
          useCookie,
          differentDomains,
          initial: localeSetup,
          skipSettingLocaleOnNavigate,
          lazy
        })), __temp2 = await __temp2, __restore2(), __temp2);
        if (modified && localeSetup) {
          notInitialSetup = false;
        }
        const redirectPath = detectRedirect({
          route: { to, from },
          context: nuxtContext,
          targetLocale: locale,
          routeLocaleGetter: getLocaleFromRoute,
          nuxtI18nOptions,
          calledWithRouting: true
        });
        routeChangeCount++;
        return navigate(
          {
            i18n,
            redirectPath,
            locale,
            route: to
          },
          {
            differentDomains,
            skipSettingLocaleOnNavigate,
            rootRedirect
          }
        );
      }),
      { global: true }
    );
  }
});
const baseUrl = "http://localhost:3000";
const useI18nStore = defineStore({
  id: "i18n",
  state: () => ({
    enData: null,
    ptData: null,
    esData: null
  }),
  actions: {
    async fetchEnData() {
      try {
        const response = await axios.get(`${baseUrl}/lang/enUS.yaml`);
        const parsedData = yaml.load(response.data);
        this.enData = parsedData;
      } catch (error) {
        console.error("Erro ao carregar a base de tradução: ", error);
      }
    },
    async fetchPtData() {
      try {
        const response = await axios.get(`${baseUrl}/lang/ptBR.yaml`);
        const parsedData = yaml.load(response.data);
        this.ptData = parsedData;
      } catch (error) {
        console.error("Erro ao carregar a base de tradução: ", error);
      }
    },
    async fetchEsData() {
      try {
        const response = await axios.get(`${baseUrl}/lang/es.yaml`);
        const parsedData = yaml.load(response.data);
        this.esData = parsedData;
      } catch (error) {
        console.error("Erro ao carregar a base de tradução: ", error);
      }
    }
  }
});
const load_i18n_JTOJbG3CUJ = /* @__PURE__ */ defineNuxtPlugin(async (nuxtApp) => {
  let __temp, __restore;
  const i18nStore = useI18nStore();
  [__temp, __restore] = executeAsync(() => i18nStore.fetchEnData()), await __temp, __restore();
  [__temp, __restore] = executeAsync(() => i18nStore.fetchPtData()), await __temp, __restore();
  [__temp, __restore] = executeAsync(() => i18nStore.fetchEsData()), await __temp, __restore();
});
const text_limiter_8ORCBWa0eX = /* @__PURE__ */ defineNuxtPlugin(async (nuxtApp) => {
  const limitText = (text, limit = 100) => {
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };
  nuxtApp.provide("limitText", limitText);
});
const plugins = [
  unhead_KgADcZ0jPj,
  plugin$1,
  plugin,
  revive_payload_server_eJ33V7gbc6,
  components_plugin_KR1HBZs4kY,
  colors_244lXBzhnM,
  plugin_server_XNCxeHyTuP,
  composition_sLxaNGmlSL,
  i18n_yfWm7jX06p,
  load_i18n_JTOJbG3CUJ,
  text_limiter_8ORCBWa0eX
];
const _wrapIf = (component, props, slots) => {
  props = props === true ? {} : props;
  return { default: () => {
    var _a;
    return props ? h(component, props, slots) : (_a = slots.default) == null ? void 0 : _a.call(slots);
  } };
};
const layouts = {
  default: () => import("./_nuxt/default-e2494440.js").then((m) => m.default || m),
  "footer-2": () => import("./_nuxt/footer-2-da2e15f6.js").then((m) => m.default || m),
  "no-header-footer": () => import("./_nuxt/no-header-footer-770563ba.js").then((m) => m.default || m)
};
const LayoutLoader = /* @__PURE__ */ defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => h(LayoutComponent, props.layoutProps, context.slots);
  }
});
const __nuxt_component_0 = /* @__PURE__ */ defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => unref(props.name) ?? route.meta.layout ?? "default");
    const layoutRef = ref();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            // @ts-expect-error seems to be an issue in vue types
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value,
              name: layout.value,
              shouldProvide: !props.name,
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = /* @__PURE__ */ defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    return () => {
      var _a, _b;
      if (!name || typeof name === "string" && !(name in layouts)) {
        return (_b = (_a = context.slots).default) == null ? void 0 : _b.call(_a);
      }
      return h(
        // @ts-expect-error seems to be an issue in vue types
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const RouteProvider = /* @__PURE__ */ defineComponent({
  name: "RouteProvider",
  props: {
    vnode: {
      type: Object,
      required: true
    },
    route: {
      type: Object,
      required: true
    },
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key]
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const __nuxt_component_1 = /* @__PURE__ */ defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, expose }) {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    let vnode;
    const done = nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            return;
          }
          const key = generateRouteKey(routeProps, props.pageKey);
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          vnode = _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive,
              h(Suspense, {
                suspensible: true,
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).finally(done));
                }
              }, {
                // @ts-expect-error seems to be an issue in vue types
                default: () => h(RouteProvider, {
                  key,
                  vnode: routeProps.Component,
                  route: routeProps.route,
                  renderKey: key,
                  trackRootNodes: hasTransition,
                  vnodeRef: pageRef
                })
              })
            )
          ).default();
          return vnode;
        }
      });
    };
  }
});
function _toArray(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
}
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: _toArray(prop.onAfterLeave)
  }));
  return defu(..._props);
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0;
  const _component_NuxtPage = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_NuxtLayout, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const _imports_0 = "" + __publicAssetsURL("assets/images/error-404.png");
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "error",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><section id="page-404" class="bg--white-300 division"><div class="container"><div class="row justify-content-center"><div class="col-md-9 col-lg-8"><div class="page-404-txt text-center"><div class="rel page-404-img"><img class="img-fluid"${ssrRenderAttr("src", _imports_0)} alt="error-404-img"></div><h2 class="s-56 w-700 color--dark">Page Not Found</h2><h6 class="s-22 color--grey"> Oops! The page you are looking for might have been moved, renamed or might never existed </h6><a href="/" class="btn btn--theme hover--theme">Back to home</a></div></div></div></div></section><hr class="divider divider-light"><!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = /* @__PURE__ */ defineAsyncComponent(() => import("./_nuxt/island-renderer-8a38fcd3.js").then((r) => r.default || r));
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RootComponent = _sfc_main;
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(RootComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.hooks.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);
export {
  _export_sfc as _,
  appConfig as a,
  useHead as b,
  createError as c,
  useI18nStore as d,
  entry$1 as default,
  useRouter as e,
  mergeConfig as m,
  navigateTo as n,
  useAppConfig as u
};
//# sourceMappingURL=server.mjs.map
