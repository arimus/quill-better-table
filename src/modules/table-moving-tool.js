import {createPopper} from '@popperjs/core';

export default class TableMovingTool {
  isDragging = false;
  parent = null;
  currentTarget = null;
  // google: remove event listener from bind, to get why use these variables.
  boundDrag = this.dragMoveToolHandler.bind(this);
  boundMoving = this.movingTableHandler.bind(this);
  boundDrop = this.dropMoveToolHandler.bind(this);

  constructor(table, quill, options) {
    if (!table) return null;
    this.table = table;
    this.quill = quill;
    this.options = options;
    this.domNode = null;
    this.parent = this.quill.root.parentNode;
    this.initMovingTool();

  }

  initMovingTool() {
    this.domNode = document.createElement('div');
    this.domNode.classList.add('qlbt-move-tool');
    this.domNode.innerHTML =
      `<svg style="width:22px;height:22px"  viewBox="0 0 24 24"><path class="ql-custom-stroke-2" d="M20,2H4C2.89,2 2,2.89 2,4V20C2,21.11 2.89,22 4,22H20C21.11,22 22,21.11 22,20V4C22,2.89 21.11,2 20,2M20,20H4V4H20M13,8V10H11V8H9L12,5L15,8M16,15V13H14V11H16V9L19,12M10,13H8V15L5,12L8,9V11H10M15,16L12,19L9,16H11V14H13V16" /></svg>`;
    this.domNode.addEventListener('mousedown', this.boundDrag);
    this.parent.appendChild(this.domNode);
    const tableRect = this.table.getBoundingClientRect();
    const containerRect = this.quill.root.parentNode.getBoundingClientRect();
    const tableViewRect = this.table.parentNode.getBoundingClientRect();
    // css(this.domNode, {
    //     width: '22px',
    //     height: '22px',
    //     left: ''.concat(tableRect.x - 25, 'px'),
    //     top: ''.concat(tableViewRect.top - containerRect.top, 'px')
    // });
    createPopper(this.table, this.domNode, {placement: 'bottom-start'});
  }

  locateMovingTool() {

    this.quill.getModule('better-table').hideTableTools();
  }

  dragMoveToolHandler(e) {
    this.isDragging = true;
    this.table.style.opacity = '0.3';
    document.addEventListener('mousemove', this.boundMoving);
    document.addEventListener('mouseup', this.boundDrop);

  }

  dropMoveToolHandler(e) {
    if (this.isDragging && e.target.nodeName === 'P') {
      this.table.remove();
      this.quill.root.insertBefore(this.table, e.target.nextSibling);
      this.locateMovingTool();

    }

    this.isDragging = false;
    this.table.style.opacity = '1';
    if (this.currentTarget) this.currentTarget.classList.remove('current-position-table');
    document.removeEventListener('mousemove', this.boundMoving);
    document.removeEventListener('mouseup', this.boundDrop);

  }

  movingTableHandler(e) {
    if (this.currentTarget) this.currentTarget.classList.remove('current-position-table');

    e.preventDefault();
    if (e.target.nodeName === 'P') {
      this.currentTarget = e.target;
      this.currentTarget.classList.add('current-position-table');
    }
  }

  destroy() {
    this.domNode.remove();
    return null;
  }
}
