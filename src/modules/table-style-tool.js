import { createPopper } from '@popperjs/core';
import $ from 'jquery';

export default class TableStyleTool {
  backgroundColorBound = this.backgroundColorHandler.bind(this);
  borderColorBound = this.borderColorHandler.bind(this);
  borderWidthBound = this.borderWidthHandler.bind(this);
  BorderStyleBound = this.borderStyleHandler.bind(this);
  backgroundColorBtn;
  borderColorBtn;
  borderWidthBtn;
  borderStyleBtn;

  constructor(table, quill, options) {
    if (!table) return null;
    this.table = table;
    this.quill = quill;
    this.options = options;
    this.domNode = null;
    this.parent = this.quill.root.parentNode;
    this.initStylingTool();
    this.createStyingItems();
  }

  initStylingTool() {
    this.domNode = document.createElement('div');
    this.domNode.classList.add('qlbt-style-tool');
    this.domNode.addEventListener('click', this.boundClick);
    this.parent.appendChild(this.domNode);
    const tableRect = this.table.getBoundingClientRect();
    const containerRect = this.quill.root.parentNode.getBoundingClientRect();
    const tableViewRect = this.table.parentNode.getBoundingClientRect();
    // css(this.domNode, {
    //     width: '22px',
    //     height: '22px',
    //     left: ''.concat(tableRect.x - 25, 'px'),
    //     top: ''.concat(tableViewRect.top - containerRect.top + 22, 'px')
    // });
    createPopper(this.table, this.domNode, {
        placement: 'left-start',
        modifiers: {
          offset: {
            enabled: true,
          },
          preventOverflow: {
            enabled: true,
            escapeWithReference: true,
          }
        }
      }
    );
  }

  createStyingItems() {
    // this.backgroundColorBtn = document.createElement('div');
    // this.backgroundColorBtn.id = 'backgroundColor';
    // this.backgroundColorBtn.innerHTML = `<svg style="width:22px;height:22px" viewBox="0 0 24 24">
    //     <path class="ql-custom-stroke-2" d="M19,11.5C19,11.5 17,13.67 17,15A2,2 0 0,0 19,17A2,2 0 0,0 21,15C21,13.67 19,11.5 19,11.5M5.21,10L10,5.21L14.79,10M16.56,8.94L7.62,0L6.21,1.41L8.59,3.79L3.44,8.94C2.85,9.5 2.85,10.47 3.44,11.06L8.94,16.56C9.23,16.85 9.62,17 10,17C10.38,17 10.77,16.85 11.06,16.56L16.56,11.06C17.15,10.47 17.15,9.5 16.56,8.94Z" />
    // </svg>`;

    this.borderColorBtn = document.createElement('div');
    this.borderColorBtn.id = 'borderColorBtn';
    this.borderColorBtn.innerHTML = `<svg style="width:22px;height:22px" viewBox="0 0 24 24">
        <path class="ql-custom-stroke-2" d="M20.71,4.04C21.1,3.65 21.1,3 20.71,2.63L18.37,0.29C18,-0.1 17.35,-0.1 16.96,0.29L15,2.25L18.75,6M17.75,7L14,3.25L4,13.25V17H7.75L17.75,7Z" />
    </svg>`;

    this.borderWidthBtn = document.createElement('div');
    this.borderWidthBtn.id = 'borderWidthBtn';
    this.borderWidthBtn.innerHTML = `<svg style="width:22px;height:22px" viewBox="0 0 24 24">
        <path class="ql-custom-stroke-2" d="M3,17H21V15H3V17M3,20H21V19H3V20M3,13H21V10H3V13M3,4V8H21V4H3Z" />
    </svg>`;

    this.borderStyleBtn = document.createElement('div');
    this.borderStyleBtn.id = 'BorderStyleBtn';
    this.borderStyleBtn.innerHTML = `<svg style="width:22px;height:22px" viewBox="0 0 24 24">
         <path class="ql-custom-stroke-2" d="M3,16H8V14H3V16M9.5,16H14.5V14H9.5V16M16,16H21V14H16V16M3,20H5V18H3V20M7,20H9V18H7V20M11,20H13V18H11V20M15,20H17V18H15V20M19,20H21V18H19V20M3,12H11V10H3V12M13,12H21V10H13V12M3,4V8H21V4H3Z" />
    </svg>`;

    // this.backgroundColorBtn.addEventListener('click', this.backgroundColorBound);
    this.borderColorBtn.addEventListener('click', this.borderColorBound);
    this.borderWidthBtn.addEventListener('click', this.borderWidthBound);
    this.borderStyleBtn.addEventListener('click', this.BorderStyleBound);

    // this.domNode.appendChild(this.backgroundColorBtn);
    this.domNode.appendChild(this.borderColorBtn);
    this.domNode.appendChild(this.borderWidthBtn);
    this.domNode.appendChild(this.borderStyleBtn);
  }

  backgroundColorHandler(e) {
    const clickedElement = e.currentTarget;
    if (clickedElement === this.backgroundColorBtn) {
      this.destroyCurrentPicker();
      this.createColorPicker(this.backgroundColorBtn);
    } else if (clickedElement.className === 'qlbt-style-colors-item') {
      const selectedCells = this.quill.getModule('better-table').getSelectedCells();
      if (!selectedCells) return;

      selectedCells.forEach(cell => cell.domNode.style.backgroundColor = clickedElement.dataset.value);
    }
  }

  borderColorHandler(e) {
    const clickedElement = e.currentTarget;
    if (clickedElement === this.borderColorBtn) {
      this.destroyCurrentPicker();
      const table = this.table;
      this.createColorPicker(this.borderColorBtn, (color) => {
        console.log('border color selected', color);
        console.log('modifying table', table);
        if (!table) return;
        // console.log('found tds table', $(table).find('td'));
        $(table).find('td').css('border-color', color);
      });
    }
  }

  borderWidthHandler(e) {
    const clickedElement = e.currentTarget;
    if (clickedElement === this.borderWidthBtn) {
      this.destroyCurrentPicker();
      const table = this.table;
      this.createPicker(this.borderWidthBtn, [0, 1, 1.5, 1.75, 2.0, 2.5, 3, 4.5, 6], (width) => {
        console.log('border width selected', width);
        if (!table) return;
        $(table).find('td').css('border-width', `${width}px`);
      });
    } else if (clickedElement.className === 'qlbt-style-item') {
      const selectedCells = this.quill.getModule('better-table').getSelectedCells();
      if (!selectedCells) return;

      selectedCells.forEach(cell => cell.domNode.style.borderWidth = `${clickedElement.dataset.value}px`);
    }
  }

  borderStyleHandler(e) {
    const clickedElement = e.currentTarget;
    if (clickedElement === this.borderStyleBtn) {
      this.destroyCurrentPicker();
      const table = this.table;
      this.createPicker(this.borderStyleBtn, ['solid', 'dotted', 'dashed'], (style) => {
        console.log('border borderType selected', style);
        if (!table) return;
        $(table).find('td').css('border-style', style);
      });
    } else if (clickedElement.className === 'qlbt-style-item') {
      const selectedCells = this.quill.getModule('better-table').getSelectedCells();
      if (!selectedCells) return;

      selectedCells.forEach(cell => cell.domNode.style.borderStyle = clickedElement.dataset.value);
    }
  }

  destroy() {
    this.domNode.remove();
    return null;
  }

  createPicker(pickerParent, items, selectHandler) {
    let pickerContainer = document.createElement('span');
    pickerContainer.classList.add('qlbt-style-picker-options');
    pickerParent.appendChild(pickerContainer);

    items.forEach(item => {
      let itemSpan = document.createElement('span');
      itemSpan.className = 'qlbt-style-item';
      itemSpan.dataset.value = item;

      if (pickerParent === this.borderWidthBtn) {
        itemSpan.innerText = item;
      } else {
        const line = document.createElement('div');
        line.id = item;
        itemSpan.appendChild(line);
      }

      itemSpan.addEventListener('click', function(e) {
        // set the color of the background here
        console.log('item selected', e.currentTarget, e.currentTarget.dataset.value);
        selectHandler(e.currentTarget.dataset.value);
      });

      pickerContainer.appendChild(itemSpan);
    });
  }

  createColorPicker(colorPickerParent, colorSelectedHandler) {
    let colors = [
      '#000000', '#e60000', '#ff9900', '#ffff00',
      '#008a00', '#0066cc', '#9933ff', '#ffffff',
      '#facccc', '#ffebcc', '#ffffcc', '#cce8cc',
      '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666',
      '#ffc266', '#ffff66', '#66b966', '#66a3e0',
      '#c285ff', '#888888', '#a10000', '#b26b00',
      '#b2b200', '#006100', '#0047b2', '#6b24b2',
      '#444444', '#5c0000', '#663d00', '#666600',
      '#003700', '#002966', '#3d1466', 'transparent'];

    let colorPickerContainer = document.createElement('span');
    colorPickerContainer.classList.add('qlbt-style-colors-picker-options');
    colorPickerParent.appendChild(colorPickerContainer);
    colors.forEach(color => {
      let colorSpan = document.createElement('span');
      colorSpan.className = 'qlbt-style-colors-item';
      colorSpan.dataset.value = color;
      colorSpan.style.backgroundColor = color;
      colorSpan.addEventListener('click', function(e) {
        // set the color of the background here
        console.log('color selected', e.currentTarget, e.currentTarget.dataset.value);
        colorSelectedHandler(e.currentTarget.dataset.value);
      });
      colorPickerContainer.appendChild(colorSpan);
    });
  }

  destroyCurrentPicker() {
    // if (this.backgroundColorBtn.querySelector('span'))
    //   this.backgroundColorBtn.removeChild(this.backgroundColorBtn.querySelector('span'));
    if (this.borderColorBtn.querySelector('span'))
      this.borderColorBtn.removeChild(this.borderColorBtn.querySelector('span'));
    else if (this.borderWidthBtn.querySelector('span'))
      this.borderWidthBtn.removeChild(this.borderWidthBtn.querySelector('span'));
    else if (this.borderStyleBtn.querySelector('span'))
      this.borderStyleBtn.removeChild(this.borderStyleBtn.querySelector('span'));
  }
}
