(() => {
  // node_modules/svelte/internal/index.mjs
  function noop() {
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  var is_hydrating = false;
  function start_hydrating() {
    is_hydrating = true;
  }
  function end_hydrating() {
    is_hydrating = false;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    node.parentNode.removeChild(node);
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i])
        iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.wholeText !== data)
      text2.data = data;
  }
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = Promise.resolve();
  var update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  var seen_callbacks = /* @__PURE__ */ new Set();
  var flushidx = 0;
  function flush() {
    const saved_component = current_component;
    do {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  var outroing = /* @__PURE__ */ new Set();
  var outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros
    };
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }
    outros = outros.p;
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach2, callback) {
    if (block && block.o) {
      if (outroing.has(block))
        return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach2)
            block.d(1);
          callback();
        }
      });
      block.o(local);
    }
  }
  var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
          on_destroy.push(...new_on_destroy);
        } else {
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance5, create_fragment5, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: null,
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance5 ? instance5(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment5 ? create_fragment5($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        start_hydrating();
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor, options.customElement);
      end_hydrating();
      flush();
    }
    set_current_component(parent_component);
  }
  var SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        const { on_mount } = this.$$;
        this.$$.on_disconnect = on_mount.map(run).filter(is_function);
        for (const key in this.$$.slotted) {
          this.appendChild(this.$$.slotted[key]);
        }
      }
      attributeChangedCallback(attr2, _oldValue, newValue) {
        this[attr2] = newValue;
      }
      disconnectedCallback() {
        run_all(this.$$.on_disconnect);
      }
      $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
      }
      $on(type, callback) {
        const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
        callbacks.push(callback);
        return () => {
          const index = callbacks.indexOf(callback);
          if (index !== -1)
            callbacks.splice(index, 1);
        };
      }
      $set($$props) {
        if (this.$$set && !is_empty($$props)) {
          this.$$.skip_bound = true;
          this.$$set($$props);
          this.$$.skip_bound = false;
        }
      }
    };
  }
  var SvelteComponent = class {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };

  // lib/Settings.svelte
  function create_if_block_1(ctx) {
    let div;
    let input;
    let t0;
    let label;
    let mounted;
    let dispose;
    return {
      c() {
        div = element("div");
        input = element("input");
        t0 = space();
        label = element("label");
        label.textContent = 'Use "request for comments" workflow';
        attr(input, "type", "checkbox");
        attr(input, "id", "use-rfc");
        attr(label, "for", "use-rfc");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, input);
        input.checked = ctx[0];
        append(div, t0);
        append(div, label);
        if (!mounted) {
          dispose = [
            listen(input, "change", ctx[2]),
            listen(input, "change", function() {
              if (is_function(setUseRfc(ctx[0])))
                setUseRfc(ctx[0]).apply(this, arguments);
            })
          ];
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & 1) {
          input.checked = ctx[0];
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_if_block(ctx) {
    let div;
    let input;
    let t0;
    let label;
    let mounted;
    let dispose;
    return {
      c() {
        div = element("div");
        input = element("input");
        t0 = space();
        label = element("label");
        label.textContent = 'Use version appendix (f.e. "@1.0.0") at Node names';
        attr(input, "type", "checkbox");
        attr(input, "id", "update-name");
        attr(label, "for", "update-name");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, input);
        input.checked = ctx[1];
        append(div, t0);
        append(div, label);
        if (!mounted) {
          dispose = [
            listen(input, "change", ctx[3]),
            listen(input, "change", function() {
              if (is_function(setUpdateName(ctx[1])))
                setUpdateName(ctx[1]).apply(this, arguments);
            })
          ];
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & 2) {
          input.checked = ctx[1];
        }
      },
      d(detaching) {
        if (detaching)
          detach(div);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment(ctx) {
    let details;
    let summary;
    let t1;
    let t2;
    let if_block0 = ctx[0] !== null && create_if_block_1(ctx);
    let if_block1 = ctx[1] !== null && create_if_block(ctx);
    return {
      c() {
        details = element("details");
        summary = element("summary");
        summary.textContent = "Documentwide Settings";
        t1 = space();
        if (if_block0)
          if_block0.c();
        t2 = space();
        if (if_block1)
          if_block1.c();
        attr(summary, "class", "svelte-w92wh4");
        attr(details, "class", "svelte-w92wh4");
      },
      m(target, anchor) {
        insert(target, details, anchor);
        append(details, summary);
        append(details, t1);
        if (if_block0)
          if_block0.m(details, null);
        append(details, t2);
        if (if_block1)
          if_block1.m(details, null);
      },
      p(ctx2, [dirty]) {
        if (ctx2[0] !== null) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_1(ctx2);
            if_block0.c();
            if_block0.m(details, t2);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (ctx2[1] !== null) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block(ctx2);
            if_block1.c();
            if_block1.m(details, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(details);
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
      }
    };
  }
  function setUseRfc(useRfc) {
    parent.postMessage({
      pluginMessage: {
        type: "updateSettings",
        settings: { useRfc }
      }
    }, "*");
  }
  function setUpdateName(updateName) {
    parent.postMessage({
      pluginMessage: {
        type: "updateSettings",
        settings: { updateName }
      }
    }, "*");
  }
  function instance($$self, $$props, $$invalidate) {
    let { useRfc = null } = $$props;
    let { updateName = null } = $$props;
    function input_change_handler() {
      useRfc = this.checked;
      $$invalidate(0, useRfc);
    }
    function input_change_handler_1() {
      updateName = this.checked;
      $$invalidate(1, updateName);
    }
    $$self.$$set = ($$props2) => {
      if ("useRfc" in $$props2)
        $$invalidate(0, useRfc = $$props2.useRfc);
      if ("updateName" in $$props2)
        $$invalidate(1, updateName = $$props2.updateName);
    };
    return [useRfc, updateName, input_change_handler, input_change_handler_1];
  }
  var Settings = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, { useRfc: 0, updateName: 1 });
    }
  };
  var Settings_default = Settings;

  // lib/NodeList.svelte
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[1] = list[i];
    return child_ctx;
  }
  function create_each_block(ctx) {
    let tr;
    let td0;
    let t0_value = ctx[1].name + "";
    let t0;
    let t1;
    let td1;
    let t2_value = (ctx[1].version || "not versioned") + "";
    let t2;
    let t3;
    return {
      c() {
        tr = element("tr");
        td0 = element("td");
        t0 = text(t0_value);
        t1 = space();
        td1 = element("td");
        t2 = text(t2_value);
        t3 = space();
        attr(td1, "class", "version svelte-15gjnjl");
      },
      m(target, anchor) {
        insert(target, tr, anchor);
        append(tr, td0);
        append(td0, t0);
        append(tr, t1);
        append(tr, td1);
        append(td1, t2);
        append(tr, t3);
      },
      p(ctx2, dirty) {
        if (dirty & 1 && t0_value !== (t0_value = ctx2[1].name + ""))
          set_data(t0, t0_value);
        if (dirty & 1 && t2_value !== (t2_value = (ctx2[1].version || "not versioned") + ""))
          set_data(t2, t2_value);
      },
      d(detaching) {
        if (detaching)
          detach(tr);
      }
    };
  }
  function create_fragment2(ctx) {
    let table;
    let tr;
    let t3;
    let each_value = ctx[0];
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }
    return {
      c() {
        table = element("table");
        tr = element("tr");
        tr.innerHTML = `<th class="svelte-15gjnjl">Name</th> 
		<th class="svelte-15gjnjl">Version</th>`;
        t3 = space();
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(tr, "class", "svelte-15gjnjl");
        attr(table, "class", "svelte-15gjnjl");
      },
      m(target, anchor) {
        insert(target, table, anchor);
        append(table, tr);
        append(table, t3);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(table, null);
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & 1) {
          each_value = ctx2[0];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(table, null);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(table);
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function instance2($$self, $$props, $$invalidate) {
    let { nodes = [] } = $$props;
    $$self.$$set = ($$props2) => {
      if ("nodes" in $$props2)
        $$invalidate(0, nodes = $$props2.nodes);
    };
    return [nodes];
  }
  var NodeList = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance2, create_fragment2, safe_not_equal, { nodes: 0 });
    }
  };
  var NodeList_default = NodeList;

  // lib/ActionList.svelte
  function get_each_context2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[6] = list[i];
    return child_ctx;
  }
  function create_if_block_3(ctx) {
    let span;
    let t0;
    let t1_value = ctx[2][ctx[6].label].description + "";
    let t1;
    return {
      c() {
        span = element("span");
        t0 = text("\xB7\xA0");
        t1 = text(t1_value);
        attr(span, "class", "description svelte-vdjdgi");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t0);
        append(span, t1);
      },
      p(ctx2, dirty) {
        if (dirty & 1 && t1_value !== (t1_value = ctx2[2][ctx2[6].label].description + ""))
          set_data(t1, t1_value);
      },
      d(detaching) {
        if (detaching)
          detach(span);
      }
    };
  }
  function create_if_block_12(ctx) {
    let t0_value = ctx[3](ctx[6].label) + "";
    let t0;
    let t1;
    let if_block = ctx[6].label === "toName" && create_if_block_2(ctx);
    return {
      c() {
        if (if_block)
          if_block.c();
        t0 = text(t0_value);
        t1 = text(" \u2192");
      },
      m(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert(target, t0, anchor);
        insert(target, t1, anchor);
      },
      p(ctx2, dirty) {
        if (ctx2[6].label === "toName") {
          if (if_block) {
          } else {
            if_block = create_if_block_2(ctx2);
            if_block.c();
            if_block.m(t0.parentNode, t0);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
        if (dirty & 1 && t0_value !== (t0_value = ctx2[3](ctx2[6].label) + ""))
          set_data(t0, t0_value);
      },
      d(detaching) {
        if (if_block)
          if_block.d(detaching);
        if (detaching)
          detach(t0);
        if (detaching)
          detach(t1);
      }
    };
  }
  function create_if_block_2(ctx) {
    let t;
    return {
      c() {
        t = text("@");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(t);
      }
    };
  }
  function create_if_block2(ctx) {
    let t;
    return {
      c() {
        t = text("@");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching)
          detach(t);
      }
    };
  }
  function create_each_block2(ctx) {
    let div2;
    let input;
    let input_id_value;
    let input_value_value;
    let t0;
    let label;
    let div0;
    let t1_value = ctx[2][ctx[6].label].label + "";
    let t1;
    let t2;
    let t3;
    let div1;
    let t4;
    let t5_value = (ctx[6].version || "not versioned") + "";
    let t5;
    let label_for_value;
    let t6;
    let mounted;
    let dispose;
    let if_block0 = ctx[2][ctx[6].label].description && create_if_block_3(ctx);
    let if_block1 = ctx[6].label !== "keep" && create_if_block_12(ctx);
    let if_block2 = ctx[6].label === "toName" && ctx[6].version && create_if_block2(ctx);
    return {
      c() {
        div2 = element("div");
        input = element("input");
        t0 = space();
        label = element("label");
        div0 = element("div");
        t1 = text(t1_value);
        t2 = space();
        if (if_block0)
          if_block0.c();
        t3 = space();
        div1 = element("div");
        if (if_block1)
          if_block1.c();
        t4 = space();
        if (if_block2)
          if_block2.c();
        t5 = text(t5_value);
        t6 = space();
        attr(input, "type", "radio");
        attr(input, "name", "action");
        attr(input, "id", input_id_value = ctx[6].label);
        input.__value = input_value_value = ctx[6].label;
        input.value = input.__value;
        attr(input, "class", "svelte-vdjdgi");
        ctx[5][0].push(input);
        attr(div0, "class", "header svelte-vdjdgi");
        attr(div1, "class", "body svelte-vdjdgi");
        attr(label, "for", label_for_value = ctx[6].label);
        attr(label, "class", "svelte-vdjdgi");
        attr(div2, "class", "list-element svelte-vdjdgi");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, input);
        input.checked = input.__value === ctx[1];
        append(div2, t0);
        append(div2, label);
        append(label, div0);
        append(div0, t1);
        append(div0, t2);
        if (if_block0)
          if_block0.m(div0, null);
        append(label, t3);
        append(label, div1);
        if (if_block1)
          if_block1.m(div1, null);
        append(div1, t4);
        if (if_block2)
          if_block2.m(div1, null);
        append(div1, t5);
        append(div2, t6);
        if (!mounted) {
          dispose = listen(input, "change", ctx[4]);
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & 1 && input_id_value !== (input_id_value = ctx2[6].label)) {
          attr(input, "id", input_id_value);
        }
        if (dirty & 1 && input_value_value !== (input_value_value = ctx2[6].label)) {
          input.__value = input_value_value;
          input.value = input.__value;
        }
        if (dirty & 2) {
          input.checked = input.__value === ctx2[1];
        }
        if (dirty & 1 && t1_value !== (t1_value = ctx2[2][ctx2[6].label].label + ""))
          set_data(t1, t1_value);
        if (ctx2[2][ctx2[6].label].description) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_3(ctx2);
            if_block0.c();
            if_block0.m(div0, null);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (ctx2[6].label !== "keep") {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_12(ctx2);
            if_block1.c();
            if_block1.m(div1, t4);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (ctx2[6].label === "toName" && ctx2[6].version) {
          if (if_block2) {
          } else {
            if_block2 = create_if_block2(ctx2);
            if_block2.c();
            if_block2.m(div1, t5);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
        if (dirty & 1 && t5_value !== (t5_value = (ctx2[6].version || "not versioned") + ""))
          set_data(t5, t5_value);
        if (dirty & 1 && label_for_value !== (label_for_value = ctx2[6].label)) {
          attr(label, "for", label_for_value);
        }
      },
      d(detaching) {
        if (detaching)
          detach(div2);
        ctx[5][0].splice(ctx[5][0].indexOf(input), 1);
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d();
        if (if_block2)
          if_block2.d();
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment3(ctx) {
    let div0;
    let h4;
    let t1;
    let t2;
    let div1;
    let button;
    let t3;
    let button_disabled_value;
    let mounted;
    let dispose;
    let each_value = ctx[0];
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block2(get_each_context2(ctx, each_value, i));
    }
    return {
      c() {
        div0 = element("div");
        h4 = element("h4");
        h4.textContent = "Available Options";
        t1 = space();
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t2 = space();
        div1 = element("div");
        button = element("button");
        t3 = text("save");
        attr(h4, "class", "svelte-vdjdgi");
        attr(div0, "class", "container svelte-vdjdgi");
        button.disabled = button_disabled_value = !ctx[1] || ctx[1] === "keep";
        attr(button, "class", "svelte-vdjdgi");
        attr(div1, "class", "buttons svelte-vdjdgi");
      },
      m(target, anchor) {
        insert(target, div0, anchor);
        append(div0, h4);
        append(div0, t1);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div0, null);
        }
        insert(target, t2, anchor);
        insert(target, div1, anchor);
        append(div1, button);
        append(button, t3);
        if (!mounted) {
          dispose = listen(button, "click", function() {
            if (is_function(saveAction(ctx[1], ctx[0])))
              saveAction(ctx[1], ctx[0]).apply(this, arguments);
          });
          mounted = true;
        }
      },
      p(new_ctx, [dirty]) {
        ctx = new_ctx;
        if (dirty & 15) {
          each_value = ctx[0];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context2(ctx, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block2(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div0, null);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
        if (dirty & 2 && button_disabled_value !== (button_disabled_value = !ctx[1] || ctx[1] === "keep")) {
          button.disabled = button_disabled_value;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div0);
        destroy_each(each_blocks, detaching);
        if (detaching)
          detach(t2);
        if (detaching)
          detach(div1);
        mounted = false;
        dispose();
      }
    };
  }
  function saveAction(selection, actions) {
    const action = actions.find((a) => a.label === selection);
    console.log(selection, actions, action);
    parent.postMessage({
      pluginMessage: { type: "updateVersion", action }
    }, "*");
    selection = "keep";
  }
  function instance3($$self, $$props, $$invalidate) {
    let { actions = [] } = $$props;
    let selection = "keep";
    const labels = {
      keep: { label: "Keep", description: "" },
      initial: {
        label: "Initial",
        description: "Start versioning for node"
      },
      major: {
        label: "Major",
        description: "Change may break backend"
      },
      minor: {
        label: "Minor",
        description: "Change may affect backend"
      },
      patch: {
        label: "Patch",
        description: "Fix not affecting backend"
      },
      rfc: {
        label: "Request for Comments",
        description: "New iteration for draft"
      },
      release: { label: "Release", description: "" },
      fromName: {
        label: "From Appendix",
        description: "Set inner version by appendix"
      },
      toName: {
        label: "To Appendix",
        description: "Set appendix by inner version"
      }
    };
    function currentVersionFor(label) {
      const currentAction = actions.find((a) => a.label === label);
      if (label === "toName") {
        return currentAction.nameVersion;
      } else {
        const action = actions.find((a) => a.label === "keep");
        return action.version || "not versioned";
      }
    }
    const $$binding_groups = [[]];
    function input_change_handler() {
      selection = this.__value;
      $$invalidate(1, selection);
    }
    $$self.$$set = ($$props2) => {
      if ("actions" in $$props2)
        $$invalidate(0, actions = $$props2.actions);
    };
    return [
      actions,
      selection,
      labels,
      currentVersionFor,
      input_change_handler,
      $$binding_groups
    ];
  }
  var ActionList = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance3, create_fragment3, safe_not_equal, { actions: 0 });
    }
  };
  var ActionList_default = ActionList;

  // lib/App.svelte
  function create_if_block_22(ctx) {
    let actionlist;
    let current;
    actionlist = new ActionList_default({ props: { actions: ctx[1] } });
    return {
      c() {
        create_component(actionlist.$$.fragment);
      },
      m(target, anchor) {
        mount_component(actionlist, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const actionlist_changes = {};
        if (dirty & 2)
          actionlist_changes.actions = ctx2[1];
        actionlist.$set(actionlist_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(actionlist.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(actionlist.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(actionlist, detaching);
      }
    };
  }
  function create_if_block_13(ctx) {
    let nodelist;
    let current;
    nodelist = new NodeList_default({ props: { nodes: ctx[1] } });
    return {
      c() {
        create_component(nodelist.$$.fragment);
      },
      m(target, anchor) {
        mount_component(nodelist, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const nodelist_changes = {};
        if (dirty & 2)
          nodelist_changes.nodes = ctx2[1];
        nodelist.$set(nodelist_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(nodelist.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(nodelist.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(nodelist, detaching);
      }
    };
  }
  function create_if_block3(ctx) {
    let settings_1;
    let current;
    settings_1 = new Settings_default({
      props: {
        useRfc: ctx[2].useRfc,
        updateName: ctx[2].updateName
      }
    });
    return {
      c() {
        create_component(settings_1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(settings_1, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const settings_1_changes = {};
        if (dirty & 4)
          settings_1_changes.useRfc = ctx2[2].useRfc;
        if (dirty & 4)
          settings_1_changes.updateName = ctx2[2].updateName;
        settings_1.$set(settings_1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(settings_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(settings_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(settings_1, detaching);
      }
    };
  }
  function create_fragment4(ctx) {
    let div;
    let current_block_type_index;
    let if_block0;
    let t;
    let current;
    const if_block_creators = [create_if_block_13, create_if_block_22];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (ctx2[0] === "list")
        return 0;
      if (ctx2[0] === "actions")
        return 1;
      return -1;
    }
    if (~(current_block_type_index = select_block_type(ctx, -1))) {
      if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    }
    let if_block1 = ctx[2] !== null && create_if_block3(ctx);
    return {
      c() {
        div = element("div");
        if (if_block0)
          if_block0.c();
        t = space();
        if (if_block1)
          if_block1.c();
        attr(div, "class", "body svelte-lg7e9c");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].m(div, null);
        }
        append(div, t);
        if (if_block1)
          if_block1.m(div, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if (~current_block_type_index) {
            if_blocks[current_block_type_index].p(ctx2, dirty);
          }
        } else {
          if (if_block0) {
            group_outros();
            transition_out(if_blocks[previous_block_index], 1, 1, () => {
              if_blocks[previous_block_index] = null;
            });
            check_outros();
          }
          if (~current_block_type_index) {
            if_block0 = if_blocks[current_block_type_index];
            if (!if_block0) {
              if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
              if_block0.c();
            } else {
              if_block0.p(ctx2, dirty);
            }
            transition_in(if_block0, 1);
            if_block0.m(div, t);
          } else {
            if_block0 = null;
          }
        }
        if (ctx2[2] !== null) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
            if (dirty & 4) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block3(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(div, null);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(if_block0);
        transition_in(if_block1);
        current = true;
      },
      o(local) {
        transition_out(if_block0);
        transition_out(if_block1);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].d();
        }
        if (if_block1)
          if_block1.d();
      }
    };
  }
  function instance4($$self, $$props, $$invalidate) {
    let type = "loading";
    let data = null;
    let settings = null;
    onMount(() => {
      parent.postMessage({ pluginMessage: { type: "settings" } }, "*");
    });
    window.onmessage = (event) => {
      const message = event.data.pluginMessage;
      switch (message.type) {
        case "settings":
          $$invalidate(2, settings = message.settings);
          break;
        default:
          $$invalidate(0, type = message.type);
          $$invalidate(1, data = message.data);
          break;
      }
    };
    return [type, data, settings];
  }
  var App = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance4, create_fragment4, safe_not_equal, {});
    }
  };
  var App_default = App;

  // lib/ui.js
  var app = new App_default({
    target: document.body,
    props: {
      name: "world"
    }
  });
  var ui_default = app;
})();
