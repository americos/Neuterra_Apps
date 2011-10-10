Sample.Hello = function( app ) {

	Ext.require(['Ext.data.*', 'Ext.grid.*']);
	Ext.onReady(function() {
	    // wrapped in closure to prevent global vars.
	    Ext.define('Payor', {
	        extend: 'Ext.data.Model',
	        fields: ['name', 'specialty', 'cases']
	    });

	    var Payors = Ext.create('Ext.data.Store', {
	        storeId: 'payors',
	        model: 'Payor',
	        sorters: ['name','specialty'],
	        groupField: 'name',
	        data: [{
	            name: 'Patient Responsible',
	            specialty: 'Ophthalmology',
				physician: 'EVERSON, MARSHALL, MD',
				cases : 240,
				gr: 1500,
				nr: 2300
	        },{
	            name: 'AAA',
	            specialty: 'Orthopedic Surgery',
				physician: 'SCHAFFHAUSEN, JAMES MD',	
				cases : 100,
				gr: 1200,
				nr: 2100
	        },
			{
	            name: 'Patient Responsible',
	            specialty: 'Orthopedic Surgery',
				physician: 'OLMSTED 1, STEPHEN, MD',
				cases : 200,
				gr: 800,
				nr: 300
	        }
			,{
	            name: 'AETNA (AETNASC)',
	            specialty: 'Orthopedic Surgery',
				physician: 'EBELING, PATRICK, MD',
				cases : 340,
				gr: 500,
				nr: 2100
	       	},
			{
	            name: 'AETNA (AETNASC)',
	            specialty: 'Orthopedic Surgery',
				physician: 'HADLEY, RICAHRD MD',
				cases : 160,
				gr: 1600,
				nr: 2300
	       	},
			{
	            name: 'AETNA (AETNASC)',
	            specialty: 'Orthopedic Surgery',
				physician: 'JOHNSON, NEIL, MD',
				cases : 150,
				gr: 800,
				nr: 1000
	       	},
			{
	            name: 'AETNA (AETNASC)',
	            specialty: 'Orthopedic Surgery',
				physician: 'JOHNSON, NEIL, MD',
				cases : 130,
				gr: 4500,
				nr: 8300
	       	},
			{
	            name: 'AETNA (AETNASC)',
	            specialty: 'Orthopedic Surgery',
				physician: 'OLMSTED 1, STEPHEN, MD',
				cases : 130,
				gr: 7500,
				nr: 7300
	       	},
			{
	            name: 'AETNA (AETNASC)',
	            specialty: 'Orthopedic Surgery',
				physician: 'SCHAFFHAUSEN, JAMES MD',
				cases : 350,
				gr: 3500,
				nr: 7300
	       	},
			{
	            name: 'AAA',
	            specialty: 'Podiatrist',
				physician: 'SCHAFFHAUSEN, JAMES MD',
				cases : 100,
				gr: 5500,
				nr: 7300
	        },
				{
	            name: 'AIG CLAIM SERVICES (AIG)',
	            specialty: 'Orthopedic Surgery',
				physician: 'OLMSTED 1, STEPHEN, MD',
				cases : 350,
				gr: 7500,
				nr: 9300
	        }]
	    });

	    var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	        groupHeaderTpl: '{name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
	    });

	    var grid = Ext.create('Ext.grid.Panel', {
	        renderTo: Ext.getBody(),
	        collapsible: true,
	        iconCls: 'icon-grid',
	        frame: true,
	        store: Payors,
	        width: 600,
	        height: 400,
	        title: 'Payors by Specialty',
	        features: [groupingFeature],
	        columns: [{
	            text: 'Physician',
	            flex: 1,
	            dataIndex: 'physician'
	        },{
	            text: 'Specialty',
	            flex: 1,
	            dataIndex: 'specialty'
	        },{
	            text: 'Cases',
	            flex: 1,
	            dataIndex: 'cases',
				format:'0,000'
	        },	{
		            text: 'Sum of GR per Case',
		            flex: 1,
		            dataIndex: 'gr',
					renderer: Ext.util.Format.usMoney
		        },
				{
		            text: 'Sum of NR per Case',
		            flex: 1,
					dataIndex:'nr',
		            renderer: Ext.util.Format.usMoney
		        }]
	    });
	});
};