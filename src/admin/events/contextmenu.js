import core from 'core';

import { 
  contextmenuExplorerBodyData, 
  contextmenuExplorerItemData, 
  contextmenuTabData,
  contextmenuPageData,
  contextmenuGraphItemData,
  contextmenuGraphGroupData,
} from '../temp';

// contextmenu

core.events.on('contextmenu:nav', (e, params) => {
  core.app.contextmenu.show(e, contextmenuExplorerBodyData);
});

core.events.on('contextmenu:nav:item', (e, params) => {
  core.app.contextmenu.show(e, contextmenuExplorerItemData);
});

core.events.on('contextmenu:tab', (e, params) => {
  core.app.contextmenu.show(e, contextmenuTabData);
});

core.events.on('contextmenu:page', (e, params) => {
  // core.app.contextmenu.show(e, contextmenuPageData);
});

core.events.on('contextmenu:graph:layout', (e, params) => {
  core.app.contextmenu.show(e, contextmenuPageData);
});

core.events.on('contextmenu:graph:item', (e, params) => {
  core.app.contextmenu.show(e, contextmenuGraphItemData, params);
});

core.events.on('contextmenu:graph:group', (e, params, state) => {
  core.app.contextmenu.show(e, contextmenuGraphGroupData, params, state);
});



// click
core.events.on('contextmenu:graph:paste', (item, params) => {
  core.clipboard.read()
    .then(data => {
      if (data !== null) {
        core.components.graph.addContainer(item.position, data);
      }
    })
});


core.events.on('contextmenu:graph:item:copy', (item, params) => {
  core.clipboard.write(params);
});

core.events.on('contextmenu:graph:group:copy', (item, params) => {
  core.clipboard.write(params);
});

core.events.on('contextmenu:graph:group:group', (item, params, state) => {
  core.components.graph.setGroup(state);
});

core.events.on('contextmenu:graph:group:ungroup', (item, params, state) => {
  core.components.graph.unsetGroup(state.selects.group, params);
});