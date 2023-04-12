// Create a stage
var stage = new createjs.Stage('gameCanvas');

// Create a shape for the background
var background = new createjs.Shape();
background.graphics.beginFill('lightgray').drawRect(0, 0, 800, 600);
stage.addChild(background);

// Define an array of block colors
var blockColors = ['red', 'blue', 'green'];

// 2D array to store the blocks
var blocks = [];
for (var i = 0; i < 20; i++) {
  blocks[i] = [];
}

// Create a grid of blocks
for (var i = 0; i < 20; i++) {
  for (var j = 0; j < 8; j++) {
    var blockColor = blockColors[Math.floor(Math.random() * blockColors.length)];
    var block = new createjs.Shape();
    block.graphics.beginFill(blockColor).drawRect(i * 40, j * 40, 40, 40);
    stage.addChild(block);
    blocks[i][j] = block;
  }
}

// Check if blocks are the same color
function areSameColor(block1, block2) {
  return block1.graphics._fill.style == block2.graphics._fill.style;
}

// Remove blocks from the stage and the blocks array
function removeBlock(block) {
  stage.removeChild(block);
  var blockIndex = blocks.indexOf(block);
  if (blockIndex != -1) {
    blocks.splice(blockIndex, 1);
  }
}

// Handle click event on a block
function handleClick(event) {
  var clickedBlock = event.target;
  var connectedBlocks = [];
  for (var i = 0; i < 20; i++) {
    for (var j = 0; j < 8; j++) {
      if (blocks[i][j] == clickedBlock) {
        connectedBlocks = checkConnectedBlocks(i, j);
        break;
      }
    }
  }

  // Remove connected blocks
  for (var i = 0; i < connectedBlocks.length; i++) {
    removeBlock(connectedBlocks[i]);
  }

  // Add new blocks
  for (var i = 0; i < 20; i++) {
    for (var j = 7; j >= 0; j--) {
      if (!blocks[i][j]) {
        var blockColor = blockColors[Math.floor(Math.random() * blockColors.length)];
        var block = new createjs.Shape();
        block.graphics.beginFill(blockColor).drawRect(i * 40, j * 40, 40, 40);
        block.addEventListener('click', handleClick);
        stage.addChild(block);
        blocks[i][j] = block;
        break;
      }
    }
  }

  // Animate the blocks
  createjs.Tween.get(null, {loop: false})
    .wait(500)
    .call(function() {
      for (var i = 0; i < 20; i++) {
        for (var j = 7; j >= 0; j--) {
          if (!blocks[i][j]) {
            for (var k = j - 1; k >= 0; k--) {
              if (blocks[i][k]) {
                var block = blocks[i][k];
                createjs.Tween.get(block, {loop: false})
                  .to({y: block.y + 40}, 200);
                blocks[i][k] = null;
                blocks[i][j] = block;
                break;
              }
            }
          }
        }
      }
    });

  // Update the stage
  stage.update();
}


// Check for connected blocks of the same color
function checkConnectedBlocks(i, j) {
  var connectedBlocks = [];
  var currentBlock = blocks[i][j];
  if (!currentBlock) {
    return connectedBlocks;
  }
  var stack = [[i, j]];
  while (stack.length > 0) {
    var position = stack.pop();
    var row = position[0];
    var col = position[1];
    if (row < 0 || row >= 20 || col < 0 || col >= 8) {
      continue;
    }
    var block = blocks[row][col];
    if (!block || !areSameColor(block, currentBlock)) {
      continue;
    }
    if (connectedBlocks.indexOf(block) != -1) {
      continue;
    }
    connectedBlocks.push(block);
    stack.push([row - 1, col]);
    stack.push([row + 1, col]);
    stack.push([row, col - 1]);
    stack.push([row, col + 1]);
    blocks[row][col] = null;
  }

  return connectedBlocks;
}

// Update the stage
  stage.update();