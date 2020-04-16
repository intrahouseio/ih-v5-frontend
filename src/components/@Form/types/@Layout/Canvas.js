import React, { Component } from 'react';
import core from 'core';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Scrollbars } from 'react-custom-scrollbars';

import Fab from '@material-ui/core/Fab';

import AddIcon from '@material-ui/icons/Add';

import { ContextMenu } from "@blueprintjs/core";
import Menu from 'components/Menu';

import Section from './Section';


const styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 15px',
  },
  root2: {
    width: '100%',
    height: '100%',
    display: 'flex',
    padding: 30,
  },
  stub: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 175,
  },
  stubText: {
    margin: 8,
  },
  stubButton: {
    margin: 8,
  }
}


function getIdSection(index, sections) {
  if (sections[`s${index + 1}`] === undefined) {
    return `s${index + 1}`;
  }
  return getIdSection(index + 1, sections);
}

function getIdColumn(index, sectioId, columns) {
  if (columns[`${sectioId}_c${index + 1}`] === undefined) {
    return `${sectioId}_c${index + 1}`;
  }
  return getIdColumn(index + 1, sectioId, columns);
}

function moveTo(list, index, id) {
  const result = Array.from(list);
  result.splice(index, 0, id);

  return result;
}

function removeTo(list, index) {
  const result = Array.from(list);
  result.splice(index, 1)

  return result;
}

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}


class Canvas extends Component {

  handleHoverEnter = (sectionId, columnId) => {
    core.actions.layout
      .hover(
        this.props.id, this.props.prop, 
        { section: sectionId, column: columnId }
      )
  }

  handleHoverOut = (e) => {
    if (this.props.hover.section !== null && this.props.hover.column !== null) {
      let check = false;

      const elements = window.document.elementsFromPoint(e.clientX, e.clientY);

      elements.forEach(i => {
        const sectionid = i.getAttribute('sectionid');
        const columnid = i.getAttribute('columnid');
        
        if (sectionid && sectionid !== '' && columnid && columnid !== '') {
          check = true;
        }
      });

      if (!check) {
        core.actions.layout
        .hover(
          this.props.id, this.props.prop, 
          { section: null, column: null }
        )
      }
    }
  }

  handleCheckHover = (e) => {
    let found = false;

    const elements = window.document.elementsFromPoint(e.clientX, e.clientY);

    elements.forEach(i => {
      const sectionid = i.getAttribute('sectionid');
      const columnid = i.getAttribute('columnid');
      
      if (sectionid && sectionid !== '' && columnid && columnid !== '') {
        found = { sectionId: sectionid, columnId: columnid };
      }
    });

    if (found) {
      core.actions.layout
        .hover(
          this.props.id, this.props.prop, 
          { section: found.sectionId, column: found.columnId });
    } else {
      core.actions.layout
        .hover(
          this.props.id, this.props.prop, 
          { section: null, column: null });
    }
  }

  handleClickToolbar = (e, button, value) => {
    e.preventDefault();
    e.stopPropagation();

    if (button === 'b1') {
      this.handleAddSection(value);
    }
    if (button === 'b2') {
      this.handleClickSection(value);
    }
    if (button === 'b3') {
      this.handleRemoveSection(e, value);
    }
    if (button === 'b4') {
      this.handleClickToolbarColumn(value);
    }
  }
  handleAddSection = (sectionId) => {
    const i = Number(sectionId.slice(1));
    const newSectionId = getIdSection(i, this.props.sections);

    core.actions.layout
      .addSection(
        this.props.id, this.props.prop, 
        sectionId, newSectionId,
      );
  }

  handleClickSection = (sectionId) => {
    core.actions.layout
      .select(
        this.props.id, this.props.prop, 
        { section: sectionId, column: null },
      )
  }

  handleRemoveSection = (e, sectionId) => {
    core.actions.layout
      .removeSection(
        this.props.id, this.props.prop, 
        sectionId,
      );
    
      if (e) {
        const elements = window.document.elementsFromPoint(e.clientX, e.clientY);
        elements.forEach(i => {
          const sectionid = i.getAttribute('sectionid');
          const columnid = i.getAttribute('columnid');
          
          if (sectionid && sectionid !== '' && columnid && columnid !== '') {
            this.handleHoverEnter(sectionid, columnid);
          }
        });
      }
  }

  handleClickToolbarColumn = (columnId) => {
    core.actions.layout
      .select(
        this.props.id, this.props.prop, 
        { column: columnId, section: null },
      )
  }

  handleClickColumn = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDragStart = (result) => {
    core.actions.layout
      .data(this.props.id, this.props.prop, { isDragging: true });

    if (result.type === 'section') {
      core.actions.layout
      .hover(
        this.props.id, this.props.prop, 
        { section: result.draggableId, column: null }
      )
    }
  }

  handleDragEnd = (result) => {
    core.actions.layout
      .data(this.props.id, this.props.prop, { isDragging: false });

    if (!result.destination) {
      return;
    }

    if (result.type === 'section') {
      this.handleDragEndSection(result)
    } else {
      this.handleDragEndColumn(result)
    }
  }

  handleDragEndSection = (result) => {
    const list = reorder(
      this.props.list,
      result.source.index,
      result.destination.index
    );

    core.actions.layout
      .data(
        this.props.id, this.props.prop, 
        { list },
      )
  }

  handleDragEndColumn = (result) => {
    const sourceSectionId = result.source.droppableId;
    const targetSectionId = result.destination.droppableId;


    if (sourceSectionId !== targetSectionId) {
      const sourceColumns = removeTo(
        this.props.sections[sourceSectionId].columns,
        result.source.index,
      );
      const targetColumns = moveTo(
        this.props.sections[targetSectionId].columns,
        result.destination.index,
        result.draggableId,
      );

      core.actions.layout
        .moveColumn(
          this.props.id, this.props.prop, 
          sourceSectionId, targetSectionId, sourceColumns, targetColumns,
        )
    } else {
      const columns = reorder(
        this.props.sections[targetSectionId].columns,
        result.source.index,
        result.destination.index
      );

      core.actions.layout
        .editSection(
          this.props.id, this.props.prop, 
          targetSectionId, { columns },
        )
    }
  }

  handleDragEnter = (sectionId, columnId) => {
    core.actions.layout
      .data(
        this.props.id, this.props.prop, 
        { drag: { section: null, column: columnId } }
      )
  }

  handleDragOut = (e) => {
    if (this.props.drag.column !== null) {
      let check = false;

      const elements = window.document.elementsFromPoint(e.clientX, e.clientY);

      elements.forEach(i => {
        const sectionid = i.getAttribute('sectionid');
        const columnid = i.getAttribute('columnid');
        
        if (sectionid && sectionid !== '' && columnid && columnid !== '') {
          check = true;
        }
      });

      if (!check) {
        core.actions.layout
          .data(
            this.props.id, this.props.prop, 
            { drag: { section: null, column: null } }
          )
      }
    }
  }

  handleDragDrop = (e, sectionId, columnId) => {
    const type = e.dataTransfer.getData('text');
    core.actions.layout
      .editColumn(
        this.props.id, this.props.prop, 
        columnId, { type },
      )
    core.actions.layout
      .hover(
        this.props.id, this.props.prop, 
        { section: sectionId, column: columnId }
      )
  }

  handleClickButtonStub = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
 
    const data = {
      isHoverStub: false,
      select: {
        section: 's1',
        column: null,
      },
      hover: {
        section: 's1',
        column: 's1_c1',
      },
      list: ['s1'],
      sections: { s1: { height: 100, columns: ['s1_c1'] } },
      columns: { s1_c1: { type: null } }
    };

    core.actions.layout
      .data(this.props.id, this.props.prop, data);
  }

  handleDragDropStub = () => {
    this.handleClickButtonStub(null);
  }

  handleDragEnterStub = (e) => {
    core.actions.layout
      .data(this.props.id, this.props.prop, { isHoverStub: true });
  }

  handleDragOutStub = (e) => {
    core.actions.layout
      .data(this.props.id, this.props.prop, { isHoverStub: false });
  }

  handleAddColumn = (e, sectionId, columnId) => {
    const i = Number(columnId.split('_')[1].slice(1));
    const newColumnId = getIdColumn(i, sectionId, this.props.columns);
  
    core.actions.layout
      .addColumn(this.props.id, this.props.prop, sectionId, columnId, newColumnId);

    if (e) {
      this.handleCheckHover(e);
    }
  }

  handleRemoveColumn = (e, sectionId, columnId) => {
    if (this.props.sections[sectionId].columns.length === 1) {
      core.actions.layout
        .clearSection(this.props.id, this.props.prop, sectionId);
    } else {
      core.actions.layout
        .removeColumn(this.props.id, this.props.prop, sectionId, columnId);
    }

    if (e) {
      this.handleCheckHover(e);
    }
  }

  handleContextMenu = (e, sectionId, columnId) => {
    const pos = { left: e.clientX, top: e.clientY };
    const scheme = {
      main: [
        { id: '1', title: 'Add Column', click: (e) => this.handleAddColumn(e, sectionId, columnId) },
        { id: '2', type: 'divider' },
        { id: '3', title: 'Delete', click: (e) => this.handleRemoveColumn(e, sectionId, columnId) },
      ]
    }

    ContextMenu.show(<Menu scheme={scheme} />, pos);
  }

  render() {
    if (this.props.list.length === 0) {
      return (
        <div style={styles.root2}>
          <div 
            style={{ 
              ...styles.stub, 
              border: this.props.isHoverStub ? '2px dashed #3eaaf5' : '2px dashed #BDBDBD'
            }} 
            onDrop={this.handleDragDropStub}
            onDragEnter={this.handleDragEnterStub}
            onDragLeave={this.handleDragOutStub}
          >
            <div style={{ ...styles.stub, pointerEvents: this.props.isDraggingToolbar ? 'none': 'all' }}>
              <Fab color="primary" style={styles.stubButton} onClick={this.handleClickButtonStub}>
                <AddIcon />
              </Fab>
              <div style={styles.stubText}>Drag an element here or click to add new section</div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <DragDropContext onDragStart={this.handleDragStart} onDragEnd={this.handleDragEnd}>
        <Droppable droppableId="droppable" type="section" >
        {(provided, snapshot1) => (
          <Scrollbars style={{width: '100%', height: '100%' }}>
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={styles.root}
              className="canvas"
            >
              {this.props.list
                .map((id, index) =>
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided, snapshot2) => (
                      <Section 
                        id={id}
                        provided={provided}
                        select={this.props.select}
                        hover={this.props.hover}
                        drag={this.props.drag}
                        item={this.props.sections[id]}
                        columns={this.props.columns}
                        isDraggingGlobal={this.props.isDragging}
                        isDragging={snapshot1.isDraggingOver}
                        isPreview={snapshot2.isDragging}
                        onClickToolbar={this.handleClickToolbar}
                        onClickColumn={this.handleClickColumn}
                        onHoverEnter={this.handleHoverEnter}
                        onHoverOut={this.handleHoverOut}
                        onDragEnter={this.handleDragEnter}
                        onDragOut={this.handleDragOut}
                        onDragDrop={this.handleDragDrop}
                        onContextMenu={this.handleContextMenu}
                      />
                    )}
                  </Draggable>
              )}
              {provided.placeholder}
            </div>
          </Scrollbars>
        )}
        </Droppable>
      </DragDropContext>
    );
  }

}


export default Canvas;