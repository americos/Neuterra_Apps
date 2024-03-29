Neuterra.VolumeReport = function( app ) {

 	Ext.require([
	    'Ext.form.*',
	    'Ext.data.*',
	    'Ext.chart.*',
	    'Ext.grid.Panel',
	    'Ext.layout.container.Column'
	]);


	Ext.onReady(function(){

	    //use a renderer for values in the data view.
	    function perc(v) {
	        return v + '%';
	    }

	    var bd = Ext.getBody(),
	        form = false,
	        rec = false,
	        selectedStoreItem = false,
	
	        //performs the highlight of an item in the bar series
	        selectItem = function(storeItem) {
	            var name = storeItem.get('company'),
	                series = barChart.series.get(0),
	                i, items, l;

	            series.highlight = true;
	            series.unHighlightItem();
	            series.cleanHighlights();
	            for (i = 0, items = series.items, l = items.length; i < l; i++) {
	                if (name == items[i].storeItem.get('company')) {
	                    selectedStoreItem = items[i].storeItem;
	                    series.highlightItem(items[i]);
	                    break;
	                }
	            }
	            series.highlight = false;
	        },
	        //updates a record modified via the form
	        updateRecord = function(rec) {
	            var name, series, i, l, items, json = [{
	                'Name': 'Price',
	                'Data': rec.get('price')
	            }, {
	                'Name': 'Revenue %',
	                'Data': rec.get('revenue %')
	            }, {
	                'Name': 'Growth %',
	                'Data': rec.get('growth %')
	            }, {
	                'Name': 'Product %',
	                'Data': rec.get('product %')
	            }, {
	                'Name': 'Market %',
	                'Data': rec.get('market %')
	            }];
	            chs.loadData(json);
	            selectItem(rec);
	        },
	        createListeners = function() {
	            return {
	                // buffer so we don't refire while the user is still typing
	                buffer: 200,
	                change: function(field, newValue, oldValue, listener) {
	                    form.updateRecord(rec);
	                    updateRecord(rec);
	                }
	            };
	        };

	    // sample static data for the store
	    var myData = [
	        ['PETTY CASH'],
	        ['CHECKING - FNB SOUTHWEST'],
	        ['FACILITY DIRECTORS FUND'],
	        ['ACCOUNT RECEIVABLE  -  REVENUE'],
	        ['ACCOUNT RECEIVABLE  -  OTHER'],
	        ['ALLOWANCE - BAD DEBTS'],
	        ['INVENTORY - MEDICAL'],
	        ['INVENTORY - IMPLANTS'],
	        ['INVENTORY - PHARMACY'],
	        ['PREPAID - INSURANCE'],
	        ['PREPAID - RENT'],
	        ['PREPAID - MAINTENANCE'],
	        ['PREPAID - OTHER'],
	        ['FIXED ASSETS - MEDICAL EQUIPMENT'],
	        ['FIXED ASSETS - MOVEABLE MEDICAL EQUIPMENT'],
	        ['FIXED ASSETS - MEDICAL INSTRUMENTS'],
	        ['FIXED ASSETS - OFFICE EQUIPMENT'],
	        ['LEASEHOLD IMPROVEMENTS'],
	        ['ACCUM DEPREC - FIXED MEDICAL'],
	        ['ACCUM DEPREC - MOVEABLE MEDICAL'],
	        ['PAYABLES DISCOUNT - AVAILABLE'],
	        ['ACCRUED PAYROLL EXPENSES'],
	        ['CURRENT PORTION LTD'],
	        ['MEMBER CONTRIBUTIONS'],
	        ['MEMBER DISTRIBUTIONS'],
	        ['CAPITAL ACCOUNT ADJUSTMENTS'],
	        ['RETAINED EARNINGS'],
	        ['REVENUE - ANESTHESIOLOGY'],
	        ['UNIT-ANESTHESIOLOGY PROCEDURES']
	    ];

	    for (var i = 0, l = myData.length, rand = Math.random; i < l; i++) {
	        var data = myData[i];
	        data[1] = ((rand() * 10000) >> 0) / 100;
	        data[2] = ((rand() * 10000) >> 0) / 100;
	        data[3] = ((rand() * 10000) >> 0) / 100;
	        data[4] = ((rand() * 10000) >> 0) / 100;
	        data[5] = ((rand() * 10000) >> 0) / 100;
	    }

	    //create data store to be shared among the grid and bar series.
	    var ds = Ext.create('Ext.data.ArrayStore', {
	        fields: [
	            {name: 'company'},
	            {name: 'price',   type: 'float'},
	            {name: 'revenue %', type: 'float'},
	            {name: 'growth %',  type: 'float'},
	            {name: 'product %', type: 'float'},
	            {name: 'market %',  type: 'float'}
	        ],
	        data: myData
	    });

	    //create radar dataset model.
	    var chs = Ext.create('Ext.data.JsonStore', {
	        fields: ['Name', 'Data'],
	        data: [
	        {
	            'Name': 'Price',
	            'Data': 100
	        }, {
	            'Name': 'Revenue %',
	            'Data': 100
	        }, {
	            'Name': 'Growth %',
	            'Data': 100
	        }, {
	            'Name': 'Product %',
	            'Data': 100
	        }, {
	            'Name': 'Market %',
	            'Data': 100
	        }]
	    });

	    //Radar chart will render information for a selected company in the
	    //list. Selection can also be done via clicking on the bars in the series.
	    var radarChart = Ext.create('Ext.chart.Chart', {
	        margin: '0 0 0 0',
	        insetPadding: 20,
	        flex: 1.2,
	        animate: true,
	        store: chs,
	        axes: [{
	            steps: 5,
	            type: 'Radial',
	            position: 'radial',
	            maximum: 100
	        }],
	        series: [{
	            type: 'radar',
	            xField: 'Name',
	            yField: 'Data',
	            showInLegend: false,
	            showMarkers: true,
	            markerConfig: {
	                radius: 4,
	                size: 4
	            },
	            style: {
	                fill: 'rgb(194,214,240)',
	                opacity: 0.5,
	                'stroke-width': 0.5
	            }
	        }]
	    });

	    //create a grid that will list the dataset items.
	    var gridPanel = Ext.create('Ext.grid.Panel', {
	        id: 'company-form',
	        flex: 0.60,
	        store: ds,
	        title:'Volume Data',

	        columns: [
	            {
	                id       :'company',
	                text   : 'Company',
	                flex: 1,
	                sortable : true,
	                dataIndex: 'company'
	            },
	            {
	                text   : 'Price',
	                width    : 75,
	                sortable : true,
	                dataIndex: 'price',
	                align: 'right',
	                renderer : 'usMoney'
	            },
	            {
	                text   : 'Revenue',
	                width    : 75,
	                sortable : true,
	                align: 'right',
	                dataIndex: 'revenue %',
	                renderer: perc
	            },
	            {
	                text   : 'Growth',
	                width    : 75,
	                sortable : true,
	                align: 'right',
	                dataIndex: 'growth %',
	                renderer: perc
	            },
	            {
	                text   : 'Product',
	                width    : 75,
	                sortable : true,
	                align: 'right',
	                dataIndex: 'product %',
	                renderer: perc
	            },
	            {
	                text   : 'Market',
	                width    : 75,
	                sortable : true,
	                align: 'right',
	                dataIndex: 'market %',
	                renderer: perc
	            }
	        ],

	        listeners: {
	            selectionchange: function(model, records) {
	                var json, name, i, l, items, series, fields;
	                if (records[0]) {
	                    rec = records[0];
	                    form = form || this.up('form').getForm();
	                    fields = form.getFields();
	                    // prevent change events from firing
	                    fields.each(function(field){
	                        field.suspendEvents();
	                    });
	                    form.loadRecord(rec);
	                    updateRecord(rec);
	                    fields.each(function(field){
	                        field.resumeEvents();
	                    });
	                }
	            }
	        }
	    });

	    //create a bar series to be at the top of the panel.
	    var barChart = Ext.create('Ext.chart.Chart', {
	        flex: 1,
	        shadow: true,
	        animate: true,
	        store: ds,
	        axes: [{
	            type: 'Numeric',
	            position: 'left',
	            fields: ['price'],
	            minimum: 0,
	            hidden: true
	        }, {
	            type: 'Category',
	            position: 'bottom',
	            fields: ['company'],
	            label: {
	                renderer: function(v) {
	                    return Ext.String.ellipsis(v, 15, false);
	                },
	                font: '9px Arial',
	                rotate: {
	                    degrees: 270
	                }
	            }
	        }],
	        series: [{
	            type: 'column',
	            axis: 'left',
	            highlight: true,
	            style: {
	                fill: '#456d9f'
	            },
	            highlightCfg: {
	                fill: '#a2b5ca'
	            },
	            label: {
	                contrast: true,
	                display: 'insideEnd',
	                field: 'price',
	                color: '#000',
	                orientation: 'vertical',
	                'text-anchor': 'middle'
	            },
	            listeners: {
	                'itemmouseup': function(item) {
	                     var series = barChart.series.get(0),
	                         index = Ext.Array.indexOf(series.items, item),
	                         selectionModel = gridPanel.getSelectionModel();

	                     selectedStoreItem = item.storeItem;
	                     selectionModel.select(index);
	                }
	            },
	            xField: 'name',
	            yField: ['price']
	        }]        
	    });

	    //disable highlighting by default.
	    barChart.series.get(0).highlight = false;

	    //add listener to (re)select bar item after sorting or refreshing the dataset.
	    barChart.addListener('beforerefresh', (function() {
	        var timer = false;
	        return function() {
	            clearTimeout(timer);
	            if (selectedStoreItem) {
	                timer = setTimeout(function() {
	                    selectItem(selectedStoreItem);
	                }, 900);
	            }
	        };
	    })());

	    /*
	     * Here is where we create the Form
	     */
	    var gridForm = Ext.create('Ext.form.Panel', {
	        title: 'Neuterra - Volume Report',
	        frame: true,
	        bodyPadding: 5,
	        width: 970,
	        height: 720,

	        fieldDefaults: {
	            labelAlign: 'left',
	            msgTarget: 'side'
	        },

	        layout: {
	            type: 'vbox',
	            align: 'stretch'
	        },

	        items: [
	            {
	                height: 200,
	                layout: 'fit',
	                margin: '0 0 3 0',
	                items: [barChart]
	            },
	            {

	            layout: {type: 'hbox', align: 'stretch'},
	            flex: 3,
	            border: false,
	            bodyStyle: 'background-color: transparent',

	            items: [
					gridPanel, 
					{
	                	flex: 0.4,
	                	layout: {
	                    	type: 'vbox',
	                    	align:'stretch'
	                	},
	                margin: '0 0 0 5',
	                title: 'Details Section',
	                items: [{
	                    margin: '5',
	                    xtype: 'fieldset',
	                    flex: 1,
	                    title:'Account details',
	                    defaults: {
	                        width: 240,
	                        labelWidth: 90
	                    },
	                    defaultType: 'textfield',
	                    items: [{
	                        fieldLabel: 'Name',
	                        name: 'company',
	                        disabled: true
	                    },{
	                        fieldLabel: 'Price',
	                        name: 'price',
	                        listeners: createListeners('price')
	                    },{
	                        fieldLabel: 'Revenue %',
	                        name: 'revenue %',
	                        listeners: createListeners('revenue %')
	                    },{
	                        fieldLabel: 'Growth %',
	                        name: 'growth %',
	                        listeners: createListeners('growth %')
	                    },{
	                        fieldLabel: 'Product %',
	                        name: 'product %',
	                        listeners: createListeners('product %')
	                    },{
	                        fieldLabel: 'Market %',
	                        name: 'market %',
	                        listeners: createListeners('market %')
	                    }]
	                }, radarChart]
	            }]
	        }],
	        renderTo: bd
	    });

	    var gp = Ext.getCmp('company-form');
	});
	
};