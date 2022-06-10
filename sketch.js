var bg,bgImg;
var soldier, shooterImg, shooting_position;
var enemy, enemyImg, enemyGroup;
var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;
var gameState = "fight";
var kill = 0;
var bullets = 100, bulletsGroup, bulletsImg;
var life = 3;
var lose, winning, explosionSound;


function preload(){
  
  heart1Img = loadImage("assets/heart_1.png");
  heart2Img = loadImage("assets/heart_2.png");
  heart3Img = loadImage("assets/heart_3.png");

  bulletsImg = loadImage("assets/bullet.png");

  shooterImg = loadImage("assets/shooter.png");
  shooting_position = loadImage("assets/shooting_position.png");
  enemyImg  = loadImage("assets/enemy.png");
  bgImg = loadImage("assets/bg.jpg");

  lose = loadSound("assets/lose.mp3")
  winning = loadSound("assets/win.mp3")
  explosionSound = loadSound("assets/explosion.mp3")

}

function setup(){

createCanvas(windowWidth,windowHeight);

//adding the background image
bg = createSprite(displayWidth/2-10,displayHeight/2-30,20,20)
bg.addImage(bgImg)
bg.scale = 1.5



//creating the player sprite
soldier = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
soldier.addImage(shooterImg)
soldier.scale = 0.3
soldier.debug = false
soldier.setCollider("rectangle",0,0,300,300)

heart1 = createSprite(displayWidth-90,40,20,20)
   heart1.visible = false
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.2

    heart2 = createSprite(displayWidth-90,40,20,20)
    heart2.visible = false
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.2

    heart3 = createSprite(displayWidth-90,40,20,20)
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.2
   
 bulletsGroup = new Group();   
 enemyGroup = new Group();

}

function draw() {
  background(0); 

if(gameState === "fight"){

 //displaying the appropriate image according to lives reamining
 if(life===3){
  heart3.visible = true
  heart1.visible = false
  heart2.visible = false
}
if(life===2){
  heart2.visible = true
  heart1.visible = false
  heart3.visible = false
}
if(life===1){
  heart1.visible = true
  heart3.visible = false
  heart2.visible = false
}


 //go to gameState "lost" when 0 lives are remaining
 if(life===0){
  gameState = "lost"
  
}

  //go to gameState "won" if score is 100
  if(kill==60){
    gameState = "won"
    winning.play();
  }

  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  soldier.y = soldier.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
  soldier.y = soldier.y+30
}


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  bullets = createSprite(displayWidth-1150,soldier.y-30,20,10);
  //bullets.addImage(bulletsImg);
  bullets.velocityX = 20
  
  bulletsGroup.add(bullets);
  soldier.depth = bullets.depth
  soldier.depth = soldier.depth+2
  bullets = bullets-1
  soldier.addImage(shooting_position);
 
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  soldier.addImage(shooterImg)
}

if(bullets == 0){
  gameState = "bullet";
  lose.play();
}

if(enemyGroup.isTouching(bulletsGroup)){
 

  for(var i=0;i<enemyGroup.length;i++){     
       
   if(enemyGroup[i].isTouching(bulletsGroup)){
        enemyGroup[i].destroy();
        kill = kill+1;
        bulletsGroup.destroyEach();
        explosionSound.play();
        } 
  }
 }

//reduce life and destroy zombie when player touches it
if(enemyGroup.isTouching(soldier)){
 
  lose.play();


for(var i=0;i<enemyGroup.length;i++){     
     
 if(enemyGroup[i].isTouching(soldier)){
  enemyGroup[i].destroy()
     
     life=life-1
      } 

}
}

enemies()

}

drawSprites();

//displaying the score and remaining lives and bullets
textSize(20)
  fill("white")
text("Bullets = " + bullets,displayWidth-210,displayHeight/2-250)
text("kill = " + kill,displayWidth-200,displayHeight/2-220)
text("Lives = " + life,displayWidth-200,displayHeight/2-280)

//destroy zombie and player and display a message in gameState "lost"
if(gameState == "lost"){
  
  textSize(100)
  fill("red")
  text("You Lost ",400,400)
  enemyGroup.destroyEach();
  soldier.destroy();

}

//destroy zombie and player and display a message in gameState "won"
else if(gameState == "won"){
 
  textSize(100)
  fill("yellow")
  text("You Won ",400,400)
  enemyGroup.destroyEach();
  soldier.destroy();

}



//destroy zombie, player and bullets and display a message in gameState "bullet"
else if(gameState == "bullet"){
 
  textSize(50)
  fill("yellow")
  text("You ran out of bullets!!!",470,410)
  enemyGroup.destroyEach();
  soldier.destroy();
  bulletGroup.destroyEach();

}

}

function enemies(){
  if(frameCount%50 === 0){
    enemy = createSprite(random(550,1100),random(100,600),30,30);
    enemy.addImage(enemyImg);
    enemy.velocityX = -5;
    enemy.scale = 1.7;
    enemy.debug= false
    enemy.setCollider("rectangle",0,0,50,50)
   
    enemyGroup.add(enemy);
    enemy.lifetime = 400;
  }
}
