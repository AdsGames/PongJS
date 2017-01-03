
var BALL_RADIUS=16;
var ball_x=600.0;
var ball_y=400.0;
var ball_velocity_x=5.0;
var ball_velocity_y=5.0;

var PADDLE_WIDTH=16;
var PADDLE_HEIGHT=100;
var PADDLE_SPEED=4;
var paddle_human_x=880;
var paddle_human_y=200;

var paddle_cpu_x=80+16;
var paddle_cpu_y=400;

var game_state = 1;
var cpu_player=true;

// Collision between two given boxes
function collision(xMin1, xMax1, xMin2, xMax2, yMin1, yMax1, yMin2, yMax2)
{
  if (xMin1 < xMax2 && yMin1 < yMax2 && xMin2 < xMax1 && yMin2 < yMax1){
    return true;
  }
  return false;
}
function bind_mouse_to_window(){
	if(mouse_x<0)
		mouse_x=0;
	if(mouse_x>SCREEN_W)
		mouse_x=SCREEN_W;
	if(mouse_y<0)
		mouse_y=0;
	if(mouse_y>SCREEN_H)
		mouse_y=SCREEN_H;
}

// Checks if the given box has been left clicked
function location_clicked(min_x,max_x,min_y,max_y){
    if(mouse_x>min_x && mouse_x<max_x && mouse_y>min_y && mouse_y<max_y && (mouse_b & 1 || mouse_b & 2)){
        return true;
	}else{
		return false;
	}
}

// Checks if the given box has been right clicked
function location_right_clicked(min_x,max_x,min_y,max_y){
    if(mouse_x>min_x && mouse_x<max_x && mouse_y>min_y && mouse_y<max_y && mouse_b & 4){
        return true;
	}else{
		return false;
	}
}

// Finds distance between two given points
function distance_to_object(x_1,y_1,x_2,y_2){
    return sqrt((pow(x_1-x_2,2))+(pow(y_1-y_2,2)));

}

// Finds angle of point 2 relative to point 1
function find_angle(x_1,  y_1, x_2, y_2){
    var tan_1 = 0.0;
    var tan_2 = 0.0;
    tan_1=y_1-y_2;
    tan_2=x_1-x_2;

    return Math.atan2(tan_2,tan_1);
}


function draw(){	
	
	if(game_state==1){
		rectfill( canvas, 0, 0, SCREEN_W, SCREEN_H, makecol( 0, 0, 0));

		rectfill(canvas,ball_x,ball_y,ball_x+16,ball_y+16,makecol(255,255,255));
		rectfill(canvas,paddle_human_x,paddle_human_y,paddle_human_x+PADDLE_WIDTH,paddle_human_y+PADDLE_HEIGHT,makecol(255,255,255));
		rectfill(canvas,paddle_cpu_x,paddle_cpu_y,paddle_cpu_x+PADDLE_WIDTH,paddle_cpu_y+PADDLE_HEIGHT,makecol(255,255,255));

	}

}

function update(){	

	if(key[KEY_UP])
		paddle_human_y-=PADDLE_SPEED;
	if(key[KEY_DOWN])
		paddle_human_y+=PADDLE_SPEED;
	
	if(cpu_player){
		if(ball_y<paddle_cpu_y+50)
			paddle_cpu_y-=PADDLE_SPEED;
		if(ball_y>paddle_cpu_y+50)
			paddle_cpu_y+=PADDLE_SPEED;
	}
	
	if(paddle_human_y<1)
		paddle_human_y=1;
	if(paddle_human_y>SCREEN_H-PADDLE_HEIGHT-1)
		paddle_human_y=SCREEN_H-PADDLE_HEIGHT-1;

	//Mouse control code
	// bind_mouse_to_window();
	// paddle_human_y=mouse_y;

	// if(mouse_y>SCREEN_H-101)
	// 	paddle_human_y=SCREEN_H-101;
	// if(mouse_y<1)
	// 	paddle_human_y=1;
	
	ball_x+=ball_velocity_x;
	ball_y+=ball_velocity_y;


	if(ball_x<=0)
		ball_velocity_x=-ball_velocity_x;
	if(ball_y<=0)
		ball_velocity_y=-ball_velocity_y;
	
	if(ball_x>=SCREEN_W-BALL_RADIUS)
		ball_velocity_x=-ball_velocity_x;
	if(ball_y>=SCREEN_H-BALL_RADIUS)
		ball_velocity_y=-ball_velocity_y;
	
	if(collision(ball_x,ball_x+BALL_RADIUS,paddle_human_x,paddle_human_x+PADDLE_WIDTH,ball_y,ball_y+BALL_RADIUS,paddle_human_y,paddle_human_y+PADDLE_HEIGHT)){
		ball_velocity_y=-(((PADDLE_HEIGHT/2)+(paddle_human_y-ball_y))/10);
		ball_velocity_x=-ball_velocity_x;
	}

	if(collision(ball_x,ball_x+BALL_RADIUS,paddle_cpu_x,paddle_cpu_x+PADDLE_WIDTH,ball_y,ball_y+BALL_RADIUS,paddle_cpu_y,paddle_cpu_y+PADDLE_HEIGHT)){
		ball_velocity_y=-(((PADDLE_HEIGHT/2)+(paddle_cpu_y-ball_y))/10);
		ball_velocity_x=-ball_velocity_x;
	}
	
	
	
	

}


function setup(){

	
}

function main()
{
	enable_debug('debug');
	allegro_init_all("game_canvas", 960,720);
	
	setup();
	ready(function(){
		loop(function(){
			clear_to_color(canvas,makecol(255,255,255));
			update();
			draw();
		},BPS_TO_TIMER(60));
	});
	return 0;
}
END_OF_MAIN();

 
