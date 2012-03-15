var available_colors = ['red', 'green', 'blue', 'purple', 'orange', 'black', 'yellow'];

var radio = require('radio');

/**
 * individual blocks in grid
 */ 
function Block(options) {

  options = options || {};

  this.on = ko.observable(false);
  this.color = ko.observable('black');

}

Block.prototype = {

  show: function() {
    this.on(true);
  },

  random_color: function() {
    this.color(available_colors[Math.floor(Math.random() * available_colors.length)]);
  }

};




/**
 * entire playing board grid
 */ 
function Board(options) {
  var self = this;
  options = options || {};

  var multi_array = require('./utils').multi_array;

  this.player = ko.observable(options.player);
  this.width = ko.observable(options.width || 12);
  this.height = ko.observable(options.height || 22);
  this.rows = ko.observableArray(multi_array([this.height(), this.width()], function() {
    return new Block();
  }));

  // Events
  radio('player.update').subscribe([this.render, this]);

}

Board.prototype = {
  clear_board: function() {
    var rows = this.rows();
    for(var r = 0; r < this.width(); r++) {
      for(var c = 0; c < this.height(); c++) {
        rows[c][r].on(false);
      }
    }
  },
  start: function(type) {
    this.clear_board();
    this.player().add_block(type,0,7);
    this.render(this.player().board.block);
  },
  down: function() {
    this.player().shift_down();
    this.render(this.player().board.block);
  },
  left: function() {
    this.player().shift_left();
    this.render(this.player().board.block);
  },
  right: function() {
    this.player().shift_right();
    this.render(this.player().board.block);
  },
  rotate: function() {
    this.player().rotate_left();
    this.render(this.player().board.block);
  },
  render: function(block) {
    var block_rows;
    var board_rows = this.player().board.rows;
    var rows = this.rows();
    var on, line;
    var width = this.width(), height = this.height();
    var x, y;

    // Render the board
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        on = (board_rows[y][x] !== ' ' && board_rows[y][x] !== '.');
        rows[y][x].on(on);
      }
    }
    
    if (block) {
      block_rows = block.get_rows();

      // Render the block
      for (y = 0; y < block_rows.length; y++) {
        for (x = 0; x < block_rows[y].length; x++) {
          on = (block_rows[y][x] !== ' ');
          if (on) {
            rows[block.y + y][block.x + x].color(available_colors[block.type_index]);
            rows[block.y + y][block.x + x].on(true);
          }
        }
      }
    }
  }
};
