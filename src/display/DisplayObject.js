(function ($, gc) {
    "use strict";
    
    /**
     * @main gc
     * @module gc
     **/
    gc.display = gc.display || {};
    
    var PointMake = gc.graph.PointMake,
        PointMake3d = gc.graph.PointMake3d,
        PointMakeZero = gc.graph.PointMakeZero,
        TransformMake = gc.graph.TransformMake,
        TransformMakeZero = gc.graph.TransformMakeZero,
        Transform3dMake = gc.graph.Transform3dMake,
        Transform3dMakeZero = gc.graph.Transform3dMakeZero;
    
    /**
     * Classe representativa de um objeto visual DOM.
     * @class gc.display.DisplayObject
     * @extends gc.core.EventDispatcher
     * @uses gc.display.ScrollView
     * @constructor
     * @param {Object} [options]* Zero or more optional configuration objects.
     **/
    gc.display.DisplayObject = gc.core.EventDispatcher.extend({
        
        options: {
            selector: null
        },
        
        /**
         * Objeto nativo visual.
         * @property _element
         * @private
         * @type Node
         * @default `div`
         */
        _element: null,
        
        
        /**
         * Construtor
         * @method init
         * @param {Object} [options] Configuração inicial do objeto
         *  @param {String} [options.selector] Seletor jQuery. Default `div`.
         **/
        init: function (options) {
            this.setupElementOrOptions(options);
            this._super(this._element);
        },
        
        
        /**
         * Construtor da classe
         * @method setupElementOrOptions
         * @private
         * @param {Object} [options] Objeto ou string indicando a configuração inicial
         *  @param {String} [options.selector] Seletor jQuery. Default `div`.
         **/
        setupElementOrOptions: function (options) {
            if (!options) options = {};
            
            if (options instanceof jQuery) {
                options = options.get(0);
            }
            if (typeof options['getAttribute'] !== "undefined" || 
                -1 !== $.inArray(options, [document, window, document.body]) || 
                typeof options === "string") {
                options = { selector: options };
            }
            
            this.setOptions(options);
            var selector = this.get('selector');
            if (!selector) {
                this._element = document.createElement('div');
                return;
            }
            this._element = $(selector).get(0);
        },
        
        
        /**
         * Captura o seletor do objeto.
         * @method sel
         * @public
         * @return {jQuery} Retorna uma instancia jQuery 
         **/
        sel: function () {
            return $(this._element);
        },
        
        
        /**
         * Retorna o elemento.
         * @method e
         * @public
         * @return {Node} Instacia de um objeto DOM.
         **/
        e: function () {
            return this._element;
        },
        
        
        /**
         * Retorna a posição espacial do objeto. Este objeto pode conter 6 ou 16 propriedades.
         * @method getTransform
         * @public
         * @return {Object} Retorna um objeto com as coordenadas espaciais do elemento.
         **/
        getTransform: function () {
            var matrix = this.sel().css('transform');
            if ('' == matrix || null == matrix || 'none' == matrix || undefined == matrix) return TransformMakeZero();
            var parts = matrix.replace(/matrix(3d)?\(/, '').replace(')', '').split(', ');
            if (parts.length == 6) {
                return TransformMake.apply(null, parts);
            }
            if (parts.length == 16) {
                return Transform3dMake.apply(null, parts);
            }
            return TransformMakeZero();
        },
        
        
        /**
         * Define coordenadas espaciais do objeto.
         * @method setTransform
         * @public
         * @param {Object} [params] Objeto gerado pela function TransformMake
         **/
        setTransform: function (params) {
            var matrix = TransformMakeZero();
            matrix = $.extend(matrix, params);
            var matrixParams = [matrix.scaleX, matrix.rotateX, matrix.rotateY, matrix.scaleY, matrix.translateX, matrix.translateY].join(', ');
            this.sel().css('transform', 'matrix(' + matrixParams + ')');
        },
        
        
        /**
         * Define coordenadas espaciais 3d do objeto.
         * @method setTransform3d
         * @public
         * @param {Object} [params] Objeto gerado pela function TransformMake3d
         **/
        setTransform3d: function (params) {
            var matrix = Transform3dMakeZero();
            matrix = $.extend(matrix, params);
            var matrixParams = [matrix.scaleX, matrix.a0, matrix.b0, matrix.c0, matrix.d0, 
                                matrix.scaleY, matrix.a1, matrix.b1, matrix.c1, matrix.d1,
                                matrix.scaleZ, matrix.a2, matrix.translateX, matrix.translateY, matrix.translateZ, 
                                matrix.b2].join(', ');
            this.sel().css('transform', 'matrix3d(' + matrixParams + ')');
        },
        
        
        /**
         * Retorna a posição espacial x e y do objeto.
         * @method getTranslate
         * @public
         * @return {Object} Coordenadas x e y
         **/
        getTranslate: function () {
            var supportTransform = $('html').hasClass('csstransforms');
            if (supportTransform) {
                var transform = this.getTransform();
                return PointMake(transform.translateX, transform.translateY);
            }
            var left = this.sel().css('left'),
                top  = this.sel().css('top');
            left = left == '' ? 0 : left;
            top  = top == '' ? 0 : top;
            return PointMake(left, top);
        }
    });
    
    $.document = (function () {
        return new gc.display.DisplayObject(document);
    }());
    
    $.window = (function () {
        return new gc.display.DisplayObject(window);
    }());
    
}(jQuery, window.gc = window.gc || {}));
