// ==UserScript==
// @name         DisableNewTabJump 禁止网站自动打开新标签页
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  阻止 某些example.com 自动打开新标签页和弹出窗口, 请在@match中填写需要阻止的域名或匹配正则表达式
// @author       kula
// @match        *://*.example.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// ==/UserScript==

(function () {
  "use strict";

  // 阻止通过 window.open 打开新窗口
  window.open = function () {
    return null;
  };

  // 阻止所有带有 target="_blank" 的链接
  document.addEventListener(
    "click",
    function (e) {
      let target = e.target.closest('a[target="_blank"]');
      if (target) {
        e.preventDefault();
        target.target = "_self";
        // 如果需要保持链接功能，可以手动跳转
        window.location.href = target.href;
      }
    },
    true
  ); // 使用捕获阶段确保尽早拦截

  // 阻止通过 middle click（中键点击）打开新标签页
  document.addEventListener(
    "auxclick",
    function (e) {
      if (e.button === 1 && e.target.closest("a")) {
        e.preventDefault();
      }
    },
    true
  );

  // 针对动态加载内容的 MutationObserver
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // 元素节点
          const links = node.querySelectorAll
            ? node.querySelectorAll('a[target="_blank"]')
            : [];
          links.forEach((link) => {
            link.target = "_self";
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
