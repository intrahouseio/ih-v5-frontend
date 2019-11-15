import context from 'context';


context.events.on('app:menu:init', (id) => {
  context.network.fetch({ component: 'appmenu' })
  .then(data => {
    context.actions.appmenu.setData(data);
  });
})

context.events.on('app:navigator:init', (id, routeid) => {
  context.network.fetch({ component: 'route', route: routeid })
  .then(data => {
    context.actions.table.setData('table', {
      id: '',
      selects: {
        scrollToIndex: undefined,
        lastIndex: null,
        data: {},
      },
      columns: [],
      data: [],
    });
    context.actions.explorer.setData(id, data);
  })
})

context.events.on('app:table:init', (id, tableid) => {
  context.network.fetch({ component: 'table', value: tableid })
  .then(data => {
    context.actions.table.setData('table', data);
  });
})



  /*

  context.events.on('app:menu:select', (id, values) => {

})


  context.network.fetch({ component: 'appmenu' })
  .then(data => {
    if (context.actions.app.getRoute(1)) {
      const value = data.list.find(i => i.route === context.actions.app.getRoute(1));
      if (value) {
        data.select = value.id;
        context.event('app:menu:select', id, value);
      }
    } else {
      if (data.select) {
        const value = data.list.find(i => i.id === data.select);
        context.event('app:menu:select', id, value);
      }
    }
    context.actions.appmenu.setData(id, data);
  });
  */

    /*
  context.actions.appmenu.setSelect(id, values.id);
  context.event('app:route', values.route, values)
  */