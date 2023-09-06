const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.6

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png'  
})

const fire = new Sprite({
    position: {
        x: 350,
        y: 422,
    },
    imageSrc: './img/fire_wood.png',
    scale: 2.5   
})

const flame = new Sprite({
    position: {
        x: 353,
        y: 328,
    },
    imageSrc: './img/fire_flame.png',
    scale: 2.5,
    framesMax: 19  
})

const player = new Fighter({
    position: {
    x: 0,
    y: 0 
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/Player1/idle.png',
    framesMax: 6,
    scale: 4.5,
    offset: {
        x: 0,
        y: 45
    },
    sprites : {
        idle : {
            imageSrc: './img/Player1/idle.png',
            framesMax: 6,
        },
        run : {
            imageSrc: './img/Player1/run.png',
            framesMax: 8,
        },
        jump : {
            imageSrc: './img/Player1/jump.png',
            framesMax: 3,
        },
        fall : {
            imageSrc: './img/Player1/fall.png',
            framesMax: 3,
        },
        attack1 : {
            imageSrc: './img/Player1/attack1.png',
            framesMax: 6,
        },
        hurt : {
            imageSrc: './img/Player1/hurt.png',
            framesMax: 4,
        },
        death : {
            imageSrc : './img/Player1/death.png',
            framesMax : 11,
        }  
    },
    attackBox: {
        offset: {
            x: 65,
            y: 50
        },
        width: 100,
        height: 50
    }

})

const enemy = new Fighter({
    position: {
    x: 400,
    y: 100 
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "green",
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/Player2/idle.png',
    framesMax: 6,
    scale: 4.5,
    offset: {
        x: 0,
        y: 45
    },
    sprites : {
        idle : {
            imageSrc: './img/Player2/idle.png',
            framesMax: 6,
        },
        run : {
            imageSrc: './img/Player2/run.png',
            framesMax: 8,
        },
        jump : {
            imageSrc: './img/Player2/jump.png',
            framesMax: 3,
        },
        fall : {
            imageSrc: './img/Player2/fall.png',
            framesMax: 3,
        },
        attack1 : {
            imageSrc: './img/Player2/attack1.png',
            framesMax: 6,
        },
        hurt : {
            imageSrc: './img/Player2/hurt.png',
            framesMax: 4,
        },
        death : {
            imageSrc: './img/Player2/death.png',
            framesMax: 11,
        },  
    },
    attackBox: {
        offset: {
            x: -115,
            y: 50
        },
        width: 100,
        height: 50
    } 
})

enemy.draw();

console.log(player);

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }  
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    fire.update()
    flame.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    
    if (keys.a.pressed && player.lastKey === "a") {
       player.velocity.x = -5
       player.switchSprite('run')
    }
    else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // player jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }
     else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // enemy jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //detect for collision
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.framesCurrent === 3
    ) {
        enemy.hurt()
        player.isAttacking = false
        
        document.querySelector('#enemyHealth').style.width = enemy.health + "%"
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 3) {
        player.isAttacking = false
    }

    // player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent === 3
    ) {
        player.hurt()
        enemy.isAttacking = false
        //player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + "%"
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 3) {
        enemy.isAttacking = false
    }

    //end game on health 
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }

    // end game if player moves out the box
    if (player.position.x < -200 || player.position.x > 1000 || player.position.y < -500) {
        //player.dead = true
        player.switchSprite('death')
        determineWinner({player, enemy, timerId})
    }

    // end game if enemy moves out the box
    if (enemy.position.x < -200 || enemy.position.x > 1000 || enemy.position.y < -500) {
        //enemy.dead = true
        enemy.switchSprite('death')
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) { 
  switch (event.key) {
    case "d":
        keys.d.pressed = true
        player.lastKey = "d"
        break
    case "a":
        keys.a.pressed = true
        player.lastKey = "a"
        break
    case "w":
        player.velocity.y = -20
        break
    case "s":
        player.attack()
        break         
    }
  }

  if (!enemy.dead) {
  switch(event.key) {
    case "ArrowRight":
        keys.ArrowRight.pressed = true
        enemy.lastKey = "ArrowRight"
        break
    case "ArrowLeft":
        keys.ArrowLeft.pressed = true
        enemy.lastKey = "ArrowLeft"
        break
    case "ArrowUp":
        enemy.velocity.y = -20
        break
    case "ArrowDown":
        enemy.attack()
        break 
    }
  } 
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
      case "d":
          keys.d.pressed = false
          break
      case "a":
          keys.a.pressed = false
          break
    //   case "w":
    //       keys.w.pressed = false
    //       break          
    }

    //enemy keys
    switch (event.key) {
      case "ArrowRight":
          keys.ArrowRight.pressed = false
          break
      case "ArrowLeft":
          keys.ArrowLeft.pressed = false
          break      
    }
  })