
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
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
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
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
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
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
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
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
        flushing = false;
        seen_callbacks.clear();
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
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
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
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
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
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
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
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Navbar.svelte generated by Svelte v3.42.1 */

    const file$8 = "src\\Navbar.svelte";

    function create_fragment$8(ctx) {
    	let nav;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let a2;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Features";
    			t2 = space();
    			a1 = element("a");
    			a1.textContent = "Team";
    			t4 = space();
    			a2 = element("a");
    			a2.textContent = "Sign In";
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Logo");
    			attr_dev(img, "class", "svelte-68hgs5");
    			add_location(img, file$8, 45, 2, 662);
    			attr_dev(div0, "class", "logo svelte-68hgs5");
    			add_location(div0, file$8, 44, 1, 640);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "nav-link svelte-68hgs5");
    			add_location(a0, file$8, 49, 2, 727);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "nav-link svelte-68hgs5");
    			add_location(a1, file$8, 50, 2, 772);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "nav-link svelte-68hgs5");
    			add_location(a2, file$8, 51, 2, 813);
    			attr_dev(div1, "class", "navbar-menu svelte-68hgs5");
    			add_location(div1, file$8, 48, 1, 698);
    			attr_dev(nav, "class", "svelte-68hgs5");
    			add_location(nav, file$8, 43, 0, 632);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div0);
    			append_dev(div0, img);
    			append_dev(nav, t0);
    			append_dev(nav, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t2);
    			append_dev(div1, a1);
    			append_dev(div1, t4);
    			append_dev(div1, a2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	let src = `images/logo.svg`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ src });

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\button.svelte generated by Svelte v3.42.1 */

    const file$7 = "src\\components\\button.svelte";

    function create_fragment$7(ctx) {
    	let button;
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(button, "type", /*type*/ ctx[1]);
    			attr_dev(button, "class", "svelte-xjzgg8");
    			add_location(button, file$7, 20, 0, 323);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);

    			if (dirty & /*type*/ 2) {
    				attr_dev(button, "type", /*type*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, []);
    	let { text = 'Get Started' } = $$props;
    	let { type = 'button' } = $$props;
    	const writable_props = ['text', 'type'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    	};

    	$$self.$capture_state = () => ({ text, type });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, type];
    }

    class Button$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { text: 0, type: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get text() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Hero.svelte generated by Svelte v3.42.1 */
    const file$6 = "src\\Hero.svelte";

    function create_fragment$6(ctx) {
    	let header;
    	let div3;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div1;
    	let h1;
    	let t2;
    	let p;
    	let t4;
    	let div2;
    	let button;
    	let t5;
    	let img1;
    	let img1_src_value;
    	let current;

    	button = new Button$1({
    			props: { text: "Get started", type: "button" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			header = element("header");
    			div3 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "All your files in one secure location, accessible anywhere.";
    			t2 = space();
    			p = element("p");
    			p.textContent = "Fylo stores all your most important files in one secure location. Access them wherever \r\n\t  \t\tyou need, share and collaborate with friends family, and co-workers.";
    			t4 = space();
    			div2 = element("div");
    			create_component(button.$$.fragment);
    			t5 = space();
    			img1 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = "images/illustration-intro.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "illustration");
    			attr_dev(img0, "class", "svelte-129b020");
    			add_location(img0, file$6, 70, 3, 1082);
    			attr_dev(div0, "class", "illustration svelte-129b020");
    			add_location(div0, file$6, 69, 2, 1051);
    			attr_dev(h1, "class", "svelte-129b020");
    			add_location(h1, file$6, 74, 3, 1186);
    			attr_dev(p, "class", "svelte-129b020");
    			add_location(p, file$6, 76, 3, 1261);
    			attr_dev(div1, "class", "hero-text svelte-129b020");
    			add_location(div1, file$6, 73, 2, 1158);
    			attr_dev(div2, "class", "btn");
    			add_location(div2, file$6, 80, 2, 1446);
    			attr_dev(div3, "class", "wrapper svelte-129b020");
    			add_location(div3, file$6, 68, 1, 1026);
    			attr_dev(img1, "class", "curvy-bg svelte-129b020");
    			if (!src_url_equal(img1.src, img1_src_value = "./images/bg-curvy-" + /*screen*/ ctx[0] + ".svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Curvy image");
    			add_location(img1, file$6, 85, 1, 1534);
    			attr_dev(header, "class", "svelte-129b020");
    			add_location(header, file$6, 67, 0, 1015);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div3);
    			append_dev(div3, div0);
    			append_dev(div0, img0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			mount_component(button, div2, null);
    			append_dev(header, t5);
    			append_dev(header, img1);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hero', slots, []);
    	let screen = 'desktop';
    	if (window.width < 500) isScreenLarge = 'mobile';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Button: Button$1, screen });

    	$$self.$inject_state = $$props => {
    		if ('screen' in $$props) $$invalidate(0, screen = $$props.screen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [screen];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\Card.svelte generated by Svelte v3.42.1 */

    const file$5 = "src\\components\\Card.svelte";
    const get_card_text_slot_changes = dirty => ({});
    const get_card_text_slot_context = ctx => ({});
    const get_img_icon_slot_changes = dirty => ({});
    const get_img_icon_slot_context = ctx => ({});

    function create_fragment$5(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let current;
    	const img_icon_slot_template = /*#slots*/ ctx[1]["img-icon"];
    	const img_icon_slot = create_slot(img_icon_slot_template, ctx, /*$$scope*/ ctx[0], get_img_icon_slot_context);
    	const card_text_slot_template = /*#slots*/ ctx[1]["card-text"];
    	const card_text_slot = create_slot(card_text_slot_template, ctx, /*$$scope*/ ctx[0], get_card_text_slot_context);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			if (img_icon_slot) img_icon_slot.c();
    			t = space();
    			div1 = element("div");
    			if (card_text_slot) card_text_slot.c();
    			attr_dev(div0, "class", "img-icon");
    			add_location(div0, file$5, 23, 1, 320);
    			attr_dev(div1, "class", "card-text");
    			add_location(div1, file$5, 30, 1, 447);
    			attr_dev(div2, "class", "card svelte-1h9esrj");
    			add_location(div2, file$5, 22, 0, 299);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			if (img_icon_slot) {
    				img_icon_slot.m(div0, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (card_text_slot) {
    				card_text_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (img_icon_slot) {
    				if (img_icon_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						img_icon_slot,
    						img_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(img_icon_slot_template, /*$$scope*/ ctx[0], dirty, get_img_icon_slot_changes),
    						get_img_icon_slot_context
    					);
    				}
    			}

    			if (card_text_slot) {
    				if (card_text_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						card_text_slot,
    						card_text_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(card_text_slot_template, /*$$scope*/ ctx[0], dirty, get_card_text_slot_changes),
    						get_card_text_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(img_icon_slot, local);
    			transition_in(card_text_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(img_icon_slot, local);
    			transition_out(card_text_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (img_icon_slot) img_icon_slot.d(detaching);
    			if (card_text_slot) card_text_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['img-icon','card-text']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\TestiCard.svelte generated by Svelte v3.42.1 */

    const file$4 = "src\\components\\TestiCard.svelte";
    const get_client_position_slot_changes = dirty => ({});
    const get_client_position_slot_context = ctx => ({});
    const get_client_name_slot_changes = dirty => ({});
    const get_client_name_slot_context = ctx => ({});
    const get_avatar_slot_changes = dirty => ({});
    const get_avatar_slot_context = ctx => ({});
    const get_testi_text_slot_changes = dirty => ({});
    const get_testi_text_slot_context = ctx => ({});

    function create_fragment$4(ctx) {
    	let div5;
    	let div4;
    	let div0;
    	let t0;
    	let div3;
    	let div1;
    	let t1;
    	let div2;
    	let h4;
    	let t2;
    	let small;
    	let current;
    	const testi_text_slot_template = /*#slots*/ ctx[1]["testi-text"];
    	const testi_text_slot = create_slot(testi_text_slot_template, ctx, /*$$scope*/ ctx[0], get_testi_text_slot_context);
    	const avatar_slot_template = /*#slots*/ ctx[1].avatar;
    	const avatar_slot = create_slot(avatar_slot_template, ctx, /*$$scope*/ ctx[0], get_avatar_slot_context);
    	const client_name_slot_template = /*#slots*/ ctx[1]["client-name"];
    	const client_name_slot = create_slot(client_name_slot_template, ctx, /*$$scope*/ ctx[0], get_client_name_slot_context);
    	const client_position_slot_template = /*#slots*/ ctx[1]["client-position"];
    	const client_position_slot = create_slot(client_position_slot_template, ctx, /*$$scope*/ ctx[0], get_client_position_slot_context);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			if (testi_text_slot) testi_text_slot.c();
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			if (avatar_slot) avatar_slot.c();
    			t1 = space();
    			div2 = element("div");
    			h4 = element("h4");
    			if (client_name_slot) client_name_slot.c();
    			t2 = space();
    			small = element("small");
    			if (client_position_slot) client_position_slot.c();
    			attr_dev(div0, "class", "card-text svelte-hvh45v");
    			add_location(div0, file$4, 45, 2, 681);
    			attr_dev(div1, "class", "avatar svelte-hvh45v");
    			add_location(div1, file$4, 52, 3, 821);
    			attr_dev(h4, "class", "svelte-hvh45v");
    			add_location(h4, file$4, 59, 4, 957);
    			attr_dev(small, "class", "svelte-hvh45v");
    			add_location(small, file$4, 64, 4, 1052);
    			attr_dev(div2, "class", "client-info svelte-hvh45v");
    			add_location(div2, file$4, 58, 3, 926);
    			attr_dev(div3, "class", "card-footer svelte-hvh45v");
    			add_location(div3, file$4, 51, 2, 791);
    			attr_dev(div4, "class", "card-body");
    			add_location(div4, file$4, 44, 1, 654);
    			attr_dev(div5, "class", "card-wrapper svelte-hvh45v");
    			add_location(div5, file$4, 43, 0, 625);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);

    			if (testi_text_slot) {
    				testi_text_slot.m(div0, null);
    			}

    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div1);

    			if (avatar_slot) {
    				avatar_slot.m(div1, null);
    			}

    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, h4);

    			if (client_name_slot) {
    				client_name_slot.m(h4, null);
    			}

    			append_dev(div2, t2);
    			append_dev(div2, small);

    			if (client_position_slot) {
    				client_position_slot.m(small, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (testi_text_slot) {
    				if (testi_text_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						testi_text_slot,
    						testi_text_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(testi_text_slot_template, /*$$scope*/ ctx[0], dirty, get_testi_text_slot_changes),
    						get_testi_text_slot_context
    					);
    				}
    			}

    			if (avatar_slot) {
    				if (avatar_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						avatar_slot,
    						avatar_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(avatar_slot_template, /*$$scope*/ ctx[0], dirty, get_avatar_slot_changes),
    						get_avatar_slot_context
    					);
    				}
    			}

    			if (client_name_slot) {
    				if (client_name_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						client_name_slot,
    						client_name_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(client_name_slot_template, /*$$scope*/ ctx[0], dirty, get_client_name_slot_changes),
    						get_client_name_slot_context
    					);
    				}
    			}

    			if (client_position_slot) {
    				if (client_position_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						client_position_slot,
    						client_position_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(client_position_slot_template, /*$$scope*/ ctx[0], dirty, get_client_position_slot_changes),
    						get_client_position_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(testi_text_slot, local);
    			transition_in(avatar_slot, local);
    			transition_in(client_name_slot, local);
    			transition_in(client_position_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(testi_text_slot, local);
    			transition_out(avatar_slot, local);
    			transition_out(client_name_slot, local);
    			transition_out(client_position_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (testi_text_slot) testi_text_slot.d(detaching);
    			if (avatar_slot) avatar_slot.d(detaching);
    			if (client_name_slot) client_name_slot.d(detaching);
    			if (client_position_slot) client_position_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TestiCard', slots, ['testi-text','avatar','client-name','client-position']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TestiCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TestiCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TestiCard",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Button.svelte generated by Svelte v3.42.1 */

    const file$3 = "src\\components\\Button.svelte";

    function create_fragment$3(ctx) {
    	let button;
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(button, "type", /*type*/ ctx[1]);
    			attr_dev(button, "class", "svelte-xjzgg8");
    			add_location(button, file$3, 20, 0, 323);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);

    			if (dirty & /*type*/ 2) {
    				attr_dev(button, "type", /*type*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, []);
    	let { text = 'Get Started' } = $$props;
    	let { type = 'button' } = $$props;
    	const writable_props = ['text', 'type'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    	};

    	$$self.$capture_state = () => ({ text, type });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, type];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { text: 0, type: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get text() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ContactCard.svelte generated by Svelte v3.42.1 */
    const file$2 = "src\\ContactCard.svelte";

    function create_fragment$2(ctx) {
    	let div2;
    	let div0;
    	let h2;
    	let t1;
    	let p0;
    	let t3;
    	let form;
    	let div1;
    	let input;
    	let t4;
    	let button;
    	let t5;
    	let p1;
    	let t6;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				type: "submit",
    				text: "Get Started For Free"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Get early access today";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "It only takes a minute to sign up and our free starter tier is extremely generous. If you have any questions, our support team would be happy to help you.";
    			t3 = space();
    			form = element("form");
    			div1 = element("div");
    			input = element("input");
    			t4 = space();
    			create_component(button.$$.fragment);
    			t5 = space();
    			p1 = element("p");
    			t6 = text(/*error*/ ctx[1]);
    			attr_dev(h2, "class", "svelte-288a50");
    			add_location(h2, file$2, 95, 2, 1670);
    			add_location(p0, file$2, 96, 2, 1705);
    			attr_dev(div0, "class", "text-wrapper svelte-288a50");
    			add_location(div0, file$2, 94, 1, 1640);
    			attr_dev(input, "type", "email");
    			input.required = true;
    			attr_dev(input, "placeholder", "email@example.com");
    			attr_dev(input, "class", "svelte-288a50");
    			add_location(input, file$2, 101, 3, 1972);
    			attr_dev(div1, "class", "input svelte-288a50");
    			add_location(div1, file$2, 100, 2, 1948);
    			attr_dev(p1, "class", "error-message svelte-288a50");
    			add_location(p1, file$2, 104, 2, 2122);
    			attr_dev(form, "method", "post");
    			attr_dev(form, "class", "form-email svelte-288a50");
    			add_location(form, file$2, 99, 1, 1880);
    			attr_dev(div2, "class", "wrapper svelte-288a50");
    			add_location(div2, file$2, 93, 0, 1616);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div2, t3);
    			append_dev(div2, form);
    			append_dev(form, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*email*/ ctx[0]);
    			append_dev(div1, t4);
    			mount_component(button, div1, null);
    			append_dev(form, t5);
    			append_dev(form, p1);
    			append_dev(p1, t6);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    					listen_dev(form, "submit", /*handleSubmit*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*email*/ 1 && input.value !== /*email*/ ctx[0]) {
    				set_input_value(input, /*email*/ ctx[0]);
    			}

    			if (!current || dirty & /*error*/ 2) set_data_dev(t6, /*error*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContactCard', slots, []);
    	let email = '';
    	let error = '';

    	function checkEmail(email) {
    		if (email == '') {
    			$$invalidate(1, error = 'Please input your email');
    		}

    		const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    		if (emailPattern.test(email) == false) {
    			$$invalidate(1, error = 'Please enter a valid email');
    		} else {
    			alert('success');
    			$$invalidate(1, error = '');
    		}
    	}

    	function handleSubmit() {
    		event.preventDefault();
    		checkEmail(email);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContactCard> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		email = this.value;
    		$$invalidate(0, email);
    	}

    	$$self.$capture_state = () => ({
    		Button,
    		email,
    		error,
    		checkEmail,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('email' in $$props) $$invalidate(0, email = $$props.email);
    		if ('error' in $$props) $$invalidate(1, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [email, error, handleSubmit, input_input_handler];
    }

    class ContactCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContactCard",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Footer.svelte generated by Svelte v3.42.1 */

    const file$1 = "src\\Footer.svelte";

    function create_fragment$1(ctx) {
    	let footer;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div7;
    	let div2;
    	let i0;
    	let t1;
    	let div1;
    	let t3;
    	let div5;
    	let div3;
    	let i1;
    	let t4;
    	let t5;
    	let div4;
    	let i2;
    	let t6;
    	let t7;
    	let nav0;
    	let a0;
    	let t9;
    	let a1;
    	let t11;
    	let a2;
    	let t13;
    	let a3;
    	let t15;
    	let nav1;
    	let a4;
    	let t17;
    	let a5;
    	let t19;
    	let a6;
    	let t21;
    	let div6;
    	let a7;
    	let i3;
    	let t22;
    	let a8;
    	let i4;
    	let t23;
    	let a9;
    	let i5;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div7 = element("div");
    			div2 = element("div");
    			i0 = element("i");
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro quo iure corporis repellat.";
    			t3 = space();
    			div5 = element("div");
    			div3 = element("div");
    			i1 = element("i");
    			t4 = text("\r\n\t\t\t\t+1-543-123-4567");
    			t5 = space();
    			div4 = element("div");
    			i2 = element("i");
    			t6 = text("\r\n\t\t\t\texample@fylo.com");
    			t7 = space();
    			nav0 = element("nav");
    			a0 = element("a");
    			a0.textContent = "About Us";
    			t9 = space();
    			a1 = element("a");
    			a1.textContent = "Jobs";
    			t11 = space();
    			a2 = element("a");
    			a2.textContent = "Press";
    			t13 = space();
    			a3 = element("a");
    			a3.textContent = "Blog";
    			t15 = space();
    			nav1 = element("nav");
    			a4 = element("a");
    			a4.textContent = "Contact Us";
    			t17 = space();
    			a5 = element("a");
    			a5.textContent = "Terms";
    			t19 = space();
    			a6 = element("a");
    			a6.textContent = "Privacy";
    			t21 = space();
    			div6 = element("div");
    			a7 = element("a");
    			i3 = element("i");
    			t22 = space();
    			a8 = element("a");
    			i4 = element("i");
    			t23 = space();
    			a9 = element("a");
    			i5 = element("i");
    			if (!src_url_equal(img.src, img_src_value = "./images/logo.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "class", "svelte-7r5xkp");
    			add_location(img, file$1, 76, 2, 1092);
    			attr_dev(div0, "class", "logo svelte-7r5xkp");
    			add_location(div0, file$1, 75, 1, 1070);
    			attr_dev(i0, "class", "bx bxs-map svelte-7r5xkp");
    			add_location(i0, file$1, 82, 3, 1210);
    			attr_dev(div1, "class", "text");
    			add_location(div1, file$1, 83, 3, 1242);
    			attr_dev(div2, "class", "address box svelte-7r5xkp");
    			add_location(div2, file$1, 81, 2, 1180);
    			attr_dev(i1, "class", "bx bxs-phone-call svelte-7r5xkp");
    			add_location(i1, file$1, 90, 4, 1434);
    			attr_dev(div3, "class", "text svelte-7r5xkp");
    			add_location(div3, file$1, 89, 3, 1410);
    			attr_dev(i2, "class", "bx bxs-envelope svelte-7r5xkp");
    			add_location(i2, file$1, 95, 4, 1530);
    			attr_dev(div4, "class", "text svelte-7r5xkp");
    			add_location(div4, file$1, 94, 3, 1506);
    			attr_dev(div5, "class", "contact svelte-7r5xkp");
    			add_location(div5, file$1, 88, 2, 1384);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "svelte-7r5xkp");
    			add_location(a0, file$1, 101, 3, 1622);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "svelte-7r5xkp");
    			add_location(a1, file$1, 102, 3, 1651);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "svelte-7r5xkp");
    			add_location(a2, file$1, 103, 3, 1676);
    			attr_dev(a3, "href", "#");
    			attr_dev(a3, "class", "svelte-7r5xkp");
    			add_location(a3, file$1, 104, 3, 1702);
    			attr_dev(nav0, "class", "svelte-7r5xkp");
    			add_location(nav0, file$1, 100, 2, 1612);
    			attr_dev(a4, "href", "#");
    			attr_dev(a4, "class", "svelte-7r5xkp");
    			add_location(a4, file$1, 108, 3, 1749);
    			attr_dev(a5, "href", "#");
    			attr_dev(a5, "class", "svelte-7r5xkp");
    			add_location(a5, file$1, 109, 3, 1780);
    			attr_dev(a6, "href", "#");
    			attr_dev(a6, "class", "svelte-7r5xkp");
    			add_location(a6, file$1, 110, 3, 1806);
    			attr_dev(nav1, "class", "svelte-7r5xkp");
    			add_location(nav1, file$1, 107, 2, 1739);
    			attr_dev(i3, "class", "bx bxl-facebook svelte-7r5xkp");
    			add_location(i3, file$1, 114, 15, 1883);
    			attr_dev(a7, "href", "#");
    			attr_dev(a7, "class", "svelte-7r5xkp");
    			add_location(a7, file$1, 114, 3, 1871);
    			attr_dev(i4, "class", "bx bxl-twitter svelte-7r5xkp");
    			add_location(i4, file$1, 115, 15, 1935);
    			attr_dev(a8, "href", "#");
    			attr_dev(a8, "class", "svelte-7r5xkp");
    			add_location(a8, file$1, 115, 3, 1923);
    			attr_dev(i5, "class", "bx bxl-instagram svelte-7r5xkp");
    			add_location(i5, file$1, 116, 15, 1986);
    			attr_dev(a9, "href", "#");
    			attr_dev(a9, "class", "svelte-7r5xkp");
    			add_location(a9, file$1, 116, 3, 1974);
    			attr_dev(div6, "class", "socmed svelte-7r5xkp");
    			add_location(div6, file$1, 113, 2, 1846);
    			attr_dev(div7, "class", "footer-content svelte-7r5xkp");
    			add_location(div7, file$1, 79, 1, 1146);
    			attr_dev(footer, "class", "svelte-7r5xkp");
    			add_location(footer, file$1, 74, 0, 1059);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div0);
    			append_dev(div0, img);
    			append_dev(footer, t0);
    			append_dev(footer, div7);
    			append_dev(div7, div2);
    			append_dev(div2, i0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div7, t3);
    			append_dev(div7, div5);
    			append_dev(div5, div3);
    			append_dev(div3, i1);
    			append_dev(div3, t4);
    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			append_dev(div4, i2);
    			append_dev(div4, t6);
    			append_dev(div7, t7);
    			append_dev(div7, nav0);
    			append_dev(nav0, a0);
    			append_dev(nav0, t9);
    			append_dev(nav0, a1);
    			append_dev(nav0, t11);
    			append_dev(nav0, a2);
    			append_dev(nav0, t13);
    			append_dev(nav0, a3);
    			append_dev(div7, t15);
    			append_dev(div7, nav1);
    			append_dev(nav1, a4);
    			append_dev(nav1, t17);
    			append_dev(nav1, a5);
    			append_dev(nav1, t19);
    			append_dev(nav1, a6);
    			append_dev(div7, t21);
    			append_dev(div7, div6);
    			append_dev(div6, a7);
    			append_dev(a7, i3);
    			append_dev(div6, t22);
    			append_dev(div6, a8);
    			append_dev(a8, i4);
    			append_dev(div6, t23);
    			append_dev(div6, a9);
    			append_dev(a9, i5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.42.1 */
    const file = "src\\App.svelte";

    // (150:4) 
    function create_img_icon_slot_3(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./images/icon-access-anywhere.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "icon");
    			add_location(img, file, 150, 5, 2666);
    			attr_dev(div, "slot", "img-icon");
    			add_location(div, file, 149, 4, 2639);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_img_icon_slot_3.name,
    		type: "slot",
    		source: "(150:4) ",
    		ctx
    	});

    	return block;
    }

    // (154:4) 
    function create_card_text_slot_3(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Access your files, anywhere";
    			t1 = space();
    			p = element("p");
    			p.textContent = "The ability to use a smartphone, tablet, or computer to access your account means your \n  files follow you everywhere.";
    			add_location(h2, file, 154, 5, 2767);
    			add_location(p, file, 155, 5, 2809);
    			attr_dev(div, "slot", "card-text");
    			add_location(div, file, 153, 4, 2739);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_card_text_slot_3.name,
    		type: "slot",
    		source: "(154:4) ",
    		ctx
    	});

    	return block;
    }

    // (162:4) 
    function create_img_icon_slot_2(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./images/icon-security.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "icon");
    			add_location(img, file, 162, 5, 3000);
    			attr_dev(div, "slot", "img-icon");
    			add_location(div, file, 161, 4, 2973);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_img_icon_slot_2.name,
    		type: "slot",
    		source: "(162:4) ",
    		ctx
    	});

    	return block;
    }

    // (166:4) 
    function create_card_text_slot_2(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Security you can trust";
    			t1 = space();
    			p = element("p");
    			p.textContent = "2-factor authentication and user-controlled encryption are just a couple of the security \n  features we allow to help secure your files.";
    			add_location(h2, file, 166, 5, 3094);
    			add_location(p, file, 167, 5, 3131);
    			attr_dev(div, "slot", "card-text");
    			add_location(div, file, 165, 4, 3066);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_card_text_slot_2.name,
    		type: "slot",
    		source: "(166:4) ",
    		ctx
    	});

    	return block;
    }

    // (174:4) 
    function create_img_icon_slot_1(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./images/icon-collaboration.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "icon");
    			add_location(img, file, 174, 5, 3340);
    			attr_dev(div, "slot", "img-icon");
    			add_location(div, file, 173, 4, 3313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_img_icon_slot_1.name,
    		type: "slot",
    		source: "(174:4) ",
    		ctx
    	});

    	return block;
    }

    // (178:4) 
    function create_card_text_slot_1(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Real-time collaboration";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Securely share files and folders with friends, family and colleagues for live collaboration. \n  No email attachments required.";
    			add_location(h2, file, 178, 5, 3439);
    			add_location(p, file, 179, 5, 3477);
    			attr_dev(div, "slot", "card-text");
    			add_location(div, file, 177, 4, 3411);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_card_text_slot_1.name,
    		type: "slot",
    		source: "(178:4) ",
    		ctx
    	});

    	return block;
    }

    // (186:4) 
    function create_img_icon_slot(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./images/icon-any-file.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "icon");
    			add_location(img, file, 186, 5, 3676);
    			attr_dev(div, "slot", "img-icon");
    			add_location(div, file, 185, 4, 3649);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_img_icon_slot.name,
    		type: "slot",
    		source: "(186:4) ",
    		ctx
    	});

    	return block;
    }

    // (190:4) 
    function create_card_text_slot(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Store any type of file";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Whether you're sharing holidays photos or work documents, Fylo has you covered allowing for all \n  file types to be securely stored and shared.";
    			add_location(h2, file, 190, 5, 3770);
    			add_location(p, file, 191, 5, 3807);
    			attr_dev(div, "slot", "card-text");
    			add_location(div, file, 189, 4, 3742);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_card_text_slot.name,
    		type: "slot",
    		source: "(190:4) ",
    		ctx
    	});

    	return block;
    }

    // (216:4) 
    function create_testi_text_slot_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Fylo has improved our team productivity by an order of magnitude. Since making the switch our team has become a well-oiled collaboration machine.";
    			attr_dev(div, "slot", "testi-text");
    			add_location(div, file, 215, 4, 4643);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_testi_text_slot_2.name,
    		type: "slot",
    		source: "(216:4) ",
    		ctx
    	});

    	return block;
    }

    // (220:4) 
    function create_avatar_slot_2(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./images/profile-1.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "50");
    			attr_dev(img, "alt", "client profile image");
    			add_location(img, file, 220, 5, 4859);
    			attr_dev(div, "slot", "avatar");
    			add_location(div, file, 219, 4, 4834);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_avatar_slot_2.name,
    		type: "slot",
    		source: "(220:4) ",
    		ctx
    	});

    	return block;
    }

    // (224:4) 
    function create_client_name_slot_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Satish Patel";
    			attr_dev(div, "slot", "client-name");
    			add_location(div, file, 223, 4, 4948);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_client_name_slot_2.name,
    		type: "slot",
    		source: "(224:4) ",
    		ctx
    	});

    	return block;
    }

    // (227:4) 
    function create_client_position_slot_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Founder & CEO, Huddle";
    			attr_dev(div, "slot", "client-position");
    			add_location(div, file, 226, 4, 5006);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_client_position_slot_2.name,
    		type: "slot",
    		source: "(227:4) ",
    		ctx
    	});

    	return block;
    }

    // (233:4) 
    function create_testi_text_slot_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Fylo has improved our team productivity by an order of magnitude. Since making the switch our team has become a well-oiled collaboration machine.";
    			attr_dev(div, "slot", "testi-text");
    			add_location(div, file, 232, 4, 5109);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_testi_text_slot_1.name,
    		type: "slot",
    		source: "(233:4) ",
    		ctx
    	});

    	return block;
    }

    // (237:4) 
    function create_avatar_slot_1(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./images/profile-2.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "50");
    			attr_dev(img, "alt", "client profile image");
    			add_location(img, file, 237, 5, 5325);
    			attr_dev(div, "slot", "avatar");
    			add_location(div, file, 236, 4, 5300);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_avatar_slot_1.name,
    		type: "slot",
    		source: "(237:4) ",
    		ctx
    	});

    	return block;
    }

    // (241:4) 
    function create_client_name_slot_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Bruce McKenzie";
    			attr_dev(div, "slot", "client-name");
    			add_location(div, file, 240, 4, 5414);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_client_name_slot_1.name,
    		type: "slot",
    		source: "(241:4) ",
    		ctx
    	});

    	return block;
    }

    // (244:4) 
    function create_client_position_slot_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Founder & CEO, Huddle";
    			attr_dev(div, "slot", "client-position");
    			add_location(div, file, 243, 4, 5474);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_client_position_slot_1.name,
    		type: "slot",
    		source: "(244:4) ",
    		ctx
    	});

    	return block;
    }

    // (250:4) 
    function create_testi_text_slot(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Fylo has improved our team productivity by an order of magnitude. Since making the switch our team has become a well-oiled collaboration machine.";
    			attr_dev(div, "slot", "testi-text");
    			add_location(div, file, 249, 4, 5577);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_testi_text_slot.name,
    		type: "slot",
    		source: "(250:4) ",
    		ctx
    	});

    	return block;
    }

    // (254:4) 
    function create_avatar_slot(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./images/profile-3.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "50");
    			attr_dev(img, "alt", "client profile image");
    			add_location(img, file, 254, 5, 5793);
    			attr_dev(div, "slot", "avatar");
    			add_location(div, file, 253, 4, 5768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_avatar_slot.name,
    		type: "slot",
    		source: "(254:4) ",
    		ctx
    	});

    	return block;
    }

    // (258:4) 
    function create_client_name_slot(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Iva Boyd";
    			attr_dev(div, "slot", "client-name");
    			add_location(div, file, 257, 4, 5882);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_client_name_slot.name,
    		type: "slot",
    		source: "(258:4) ",
    		ctx
    	});

    	return block;
    }

    // (261:4) 
    function create_client_position_slot(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Founder & CEO, Huddle";
    			attr_dev(div, "slot", "client-position");
    			add_location(div, file, 260, 4, 5936);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_client_position_slot.name,
    		type: "slot",
    		source: "(261:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let navbar;
    	let t0;
    	let hero;
    	let t1;
    	let main;
    	let div2;
    	let section0;
    	let card0;
    	let t2;
    	let card1;
    	let t3;
    	let card2;
    	let t4;
    	let card3;
    	let t5;
    	let section1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t6;
    	let div1;
    	let h2;
    	let t8;
    	let p0;
    	let t10;
    	let p1;
    	let t12;
    	let a;
    	let t13;
    	let i;
    	let t14;
    	let section2;
    	let testicard0;
    	let t15;
    	let testicard1;
    	let t16;
    	let testicard2;
    	let t17;
    	let section3;
    	let contactcard;
    	let t18;
    	let footer;
    	let current;
    	navbar = new Navbar({ $$inline: true });
    	hero = new Hero({ $$inline: true });

    	card0 = new Card({
    			props: {
    				$$slots: {
    					"card-text": [create_card_text_slot_3],
    					"img-icon": [create_img_icon_slot_3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card1 = new Card({
    			props: {
    				$$slots: {
    					"card-text": [create_card_text_slot_2],
    					"img-icon": [create_img_icon_slot_2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card2 = new Card({
    			props: {
    				$$slots: {
    					"card-text": [create_card_text_slot_1],
    					"img-icon": [create_img_icon_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card3 = new Card({
    			props: {
    				$$slots: {
    					"card-text": [create_card_text_slot],
    					"img-icon": [create_img_icon_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	testicard0 = new TestiCard({
    			props: {
    				$$slots: {
    					"client-position": [create_client_position_slot_2],
    					"client-name": [create_client_name_slot_2],
    					avatar: [create_avatar_slot_2],
    					"testi-text": [create_testi_text_slot_2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	testicard1 = new TestiCard({
    			props: {
    				$$slots: {
    					"client-position": [create_client_position_slot_1],
    					"client-name": [create_client_name_slot_1],
    					avatar: [create_avatar_slot_1],
    					"testi-text": [create_testi_text_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	testicard2 = new TestiCard({
    			props: {
    				$$slots: {
    					"client-position": [create_client_position_slot],
    					"client-name": [create_client_name_slot],
    					avatar: [create_avatar_slot],
    					"testi-text": [create_testi_text_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	contactcard = new ContactCard({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(hero.$$.fragment);
    			t1 = space();
    			main = element("main");
    			div2 = element("div");
    			section0 = element("section");
    			create_component(card0.$$.fragment);
    			t2 = space();
    			create_component(card1.$$.fragment);
    			t3 = space();
    			create_component(card2.$$.fragment);
    			t4 = space();
    			create_component(card3.$$.fragment);
    			t5 = space();
    			section1 = element("section");
    			div0 = element("div");
    			img = element("img");
    			t6 = space();
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Stay productive, wherever you are";
    			t8 = space();
    			p0 = element("p");
    			p0.textContent = "Never let location be an issue when accessing your files. Fylo has you covered for all of your file storage needs.";
    			t10 = space();
    			p1 = element("p");
    			p1.textContent = "Securely share files and folders with friends, family and colleagues for live collaboration. No email attachments required.";
    			t12 = space();
    			a = element("a");
    			t13 = text("See how Fylo works ");
    			i = element("i");
    			t14 = space();
    			section2 = element("section");
    			create_component(testicard0.$$.fragment);
    			t15 = space();
    			create_component(testicard1.$$.fragment);
    			t16 = space();
    			create_component(testicard2.$$.fragment);
    			t17 = space();
    			section3 = element("section");
    			create_component(contactcard.$$.fragment);
    			t18 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(section0, "id", "card-wrapper");
    			attr_dev(section0, "class", "svelte-1bit8x0");
    			add_location(section0, file, 147, 2, 2597);
    			if (!src_url_equal(img.src, img_src_value = "./images/illustration-stay-productive.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Illustration image");
    			attr_dev(img, "class", "svelte-1bit8x0");
    			add_location(img, file, 199, 4, 4053);
    			attr_dev(div0, "class", "img svelte-1bit8x0");
    			add_location(div0, file, 198, 3, 4031);
    			attr_dev(h2, "class", "svelte-1bit8x0");
    			add_location(h2, file, 203, 4, 4169);
    			attr_dev(p0, "class", "svelte-1bit8x0");
    			add_location(p0, file, 204, 4, 4216);
    			attr_dev(p1, "class", "svelte-1bit8x0");
    			add_location(p1, file, 205, 4, 4342);
    			attr_dev(i, "class", "bx bxs-right-arrow-circle");
    			add_location(i, file, 207, 48, 4522);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "link svelte-1bit8x0");
    			add_location(a, file, 207, 4, 4478);
    			attr_dev(div1, "class", "text svelte-1bit8x0");
    			add_location(div1, file, 202, 3, 4146);
    			attr_dev(section1, "id", "stay-productive");
    			attr_dev(section1, "class", "svelte-1bit8x0");
    			add_location(section1, file, 197, 2, 3997);
    			attr_dev(section2, "id", "testimonials");
    			attr_dev(section2, "class", "svelte-1bit8x0");
    			add_location(section2, file, 212, 2, 4595);
    			attr_dev(section3, "id", "contact");
    			attr_dev(section3, "class", "svelte-1bit8x0");
    			add_location(section3, file, 267, 2, 6036);
    			attr_dev(div2, "class", "wrapper svelte-1bit8x0");
    			add_location(div2, file, 145, 1, 2572);
    			attr_dev(main, "id", "main");
    			attr_dev(main, "class", "svelte-1bit8x0");
    			add_location(main, file, 144, 0, 2554);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(hero, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, section0);
    			mount_component(card0, section0, null);
    			append_dev(section0, t2);
    			mount_component(card1, section0, null);
    			append_dev(section0, t3);
    			mount_component(card2, section0, null);
    			append_dev(section0, t4);
    			mount_component(card3, section0, null);
    			append_dev(div2, t5);
    			append_dev(div2, section1);
    			append_dev(section1, div0);
    			append_dev(div0, img);
    			append_dev(section1, t6);
    			append_dev(section1, div1);
    			append_dev(div1, h2);
    			append_dev(div1, t8);
    			append_dev(div1, p0);
    			append_dev(div1, t10);
    			append_dev(div1, p1);
    			append_dev(div1, t12);
    			append_dev(div1, a);
    			append_dev(a, t13);
    			append_dev(a, i);
    			append_dev(div2, t14);
    			append_dev(div2, section2);
    			mount_component(testicard0, section2, null);
    			append_dev(section2, t15);
    			mount_component(testicard1, section2, null);
    			append_dev(section2, t16);
    			mount_component(testicard2, section2, null);
    			append_dev(div2, t17);
    			append_dev(div2, section3);
    			mount_component(contactcard, section3, null);
    			insert_dev(target, t18, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card0_changes.$$scope = { dirty, ctx };
    			}

    			card0.$set(card0_changes);
    			const card1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card1_changes.$$scope = { dirty, ctx };
    			}

    			card1.$set(card1_changes);
    			const card2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card2_changes.$$scope = { dirty, ctx };
    			}

    			card2.$set(card2_changes);
    			const card3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card3_changes.$$scope = { dirty, ctx };
    			}

    			card3.$set(card3_changes);
    			const testicard0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				testicard0_changes.$$scope = { dirty, ctx };
    			}

    			testicard0.$set(testicard0_changes);
    			const testicard1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				testicard1_changes.$$scope = { dirty, ctx };
    			}

    			testicard1.$set(testicard1_changes);
    			const testicard2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				testicard2_changes.$$scope = { dirty, ctx };
    			}

    			testicard2.$set(testicard2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(hero.$$.fragment, local);
    			transition_in(card0.$$.fragment, local);
    			transition_in(card1.$$.fragment, local);
    			transition_in(card2.$$.fragment, local);
    			transition_in(card3.$$.fragment, local);
    			transition_in(testicard0.$$.fragment, local);
    			transition_in(testicard1.$$.fragment, local);
    			transition_in(testicard2.$$.fragment, local);
    			transition_in(contactcard.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(hero.$$.fragment, local);
    			transition_out(card0.$$.fragment, local);
    			transition_out(card1.$$.fragment, local);
    			transition_out(card2.$$.fragment, local);
    			transition_out(card3.$$.fragment, local);
    			transition_out(testicard0.$$.fragment, local);
    			transition_out(testicard1.$$.fragment, local);
    			transition_out(testicard2.$$.fragment, local);
    			transition_out(contactcard.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(hero, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			destroy_component(card0);
    			destroy_component(card1);
    			destroy_component(card2);
    			destroy_component(card3);
    			destroy_component(testicard0);
    			destroy_component(testicard1);
    			destroy_component(testicard2);
    			destroy_component(contactcard);
    			if (detaching) detach_dev(t18);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navbar,
    		Hero,
    		Card,
    		TestiCard,
    		ContactCard,
    		Footer
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
