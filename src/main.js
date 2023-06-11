import {
  BPS_TO_TIMER,
  END_OF_MAIN,
  KEY_1,
  KEY_2,
  KEY_DOWN,
  KEY_S,
  KEY_UP,
  KEY_W,
  SCREEN_H,
  SCREEN_W,
  allegro_init_all,
  canvas,
  clear_to_color,
  enable_debug,
  font,
  key,
  load_sample,
  loop,
  makecol,
  play_sample,
  ready,
  rectfill,
  textout,
} from "./allegro";

var BALL_RADIUS = 16.0;
var ball_max_velocity = 7.0;
var ball_x = 480;
var ball_y = 400.0;
var ball_velocity_x = -3.0;
var ball_velocity_y = 0.0;

var pong;
var die;
var win;

var PADDLE_WIDTH = 16;
var PADDLE_HEIGHT = 100;
var PADDLE_SPEED = 4;
var paddle_human_x = 880;
var paddle_human_y = 200;

var paddle_cpu_x = 80 - 16;
var paddle_cpu_y = 400;

var game_state = 0;
var cpu_player = true;

var cpu_score = 0;
var human_score = 0;

// Collision between two given boxes
function collision(xMin1, xMax1, xMin2, xMax2, yMin1, yMax1, yMin2, yMax2) {
  if (xMin1 < xMax2 && yMin1 < yMax2 && xMin2 < xMax1 && yMin2 < yMax1) {
    return true;
  }
  return false;
}

function draw() {
  if (game_state === 1) {
    rectfill(canvas, SCREEN_W / 2 - 1, 0, SCREEN_W / 2 + 1, SCREEN_H, makecol(255, 255, 255));

    rectfill(canvas, ball_x, ball_y, ball_x + 16, ball_y + 16, makecol(255, 255, 255));
    rectfill(canvas, paddle_human_x, paddle_human_y, paddle_human_x + PADDLE_WIDTH, paddle_human_y + PADDLE_HEIGHT, makecol(255, 255, 255));
    rectfill(canvas, paddle_cpu_x, paddle_cpu_y, paddle_cpu_x + PADDLE_WIDTH, paddle_cpu_y + PADDLE_HEIGHT, makecol(255, 255, 255));

    textout(canvas, font, cpu_score, SCREEN_W / 2 - 60, 50, 40, makecol(255, 255, 255));
    textout(canvas, font, human_score, SCREEN_W / 2 + 20, 50, 40, makecol(255, 255, 255));
  }
  if (game_state === 0) {
    textout(canvas, font, "PONG", SCREEN_W / 2 - 90, 100, 80, makecol(255, 255, 255));

    textout(canvas, font, "Press 1 for singleplayer", SCREEN_W / 2 - 140, 600, 20, makecol(255, 255, 255));
    textout(canvas, font, "Press 2 for multiplayer", SCREEN_W / 2 - 135, 630, 20, makecol(255, 255, 255));

    textout(canvas, font, "2017 ADS Games", 10, 700, 10, makecol(255, 255, 255));
    textout(canvas, font, "Danny Van Stemp", 10, 712, 10, makecol(255, 255, 255));

    textout(canvas, font, "UP/DOWN for", 700, 400, 30, makecol(255, 255, 255));
    textout(canvas, font, "player 1", 700, 440, 30, makecol(255, 255, 255));

    textout(canvas, font, "W/S for", 50, 400, 30, makecol(255, 255, 255));
    textout(canvas, font, "player 1", 50, 440, 30, makecol(255, 255, 255));
  }
}

function restart_game(isPlayerPoint) {
  ball_x = SCREEN_W / 2;
  ball_y = SCREEN_H / 2;
  ball_velocity_y = 0;
  ball_max_velocity = 7;

  if (isPlayerPoint) {
    ball_velocity_x = -3;
    human_score++;
    play_sample(win, 255, 1000, 0);
  } else {
    ball_velocity_x = 3;
    cpu_score++;
    play_sample(die, 255, 1000, 0);
  }
}

function update() {
  if (game_state === 1) {
    if (key[KEY_UP]) paddle_human_y -= PADDLE_SPEED;
    if (key[KEY_DOWN]) paddle_human_y += PADDLE_SPEED;

    if (cpu_player) {
      if (ball_y < paddle_cpu_y + 20) paddle_cpu_y -= PADDLE_SPEED;
      if (ball_y > paddle_cpu_y + 20) paddle_cpu_y += PADDLE_SPEED;
    } else {
      if (key[KEY_W]) paddle_cpu_y -= PADDLE_SPEED;
      if (key[KEY_S]) paddle_cpu_y += PADDLE_SPEED;
    }

    if (paddle_human_y < 1) paddle_human_y = 1;
    if (paddle_human_y > SCREEN_H - PADDLE_HEIGHT - 1) paddle_human_y = SCREEN_H - PADDLE_HEIGHT - 1;

    if (paddle_cpu_y < 1) paddle_cpu_y = 1;
    if (paddle_cpu_y > SCREEN_H - PADDLE_HEIGHT - 1) paddle_cpu_y = SCREEN_H - PADDLE_HEIGHT - 1;

    ball_x += ball_velocity_x;
    ball_y += ball_velocity_y;

    if (ball_x <= 0) restart_game(true);
    if (ball_x >= SCREEN_W - BALL_RADIUS) restart_game(false);

    if (ball_y <= 0) ball_velocity_y = -ball_velocity_y;

    if (ball_y >= SCREEN_H - BALL_RADIUS) ball_velocity_y = -ball_velocity_y;

    if (
      collision(
        ball_x,
        ball_x + BALL_RADIUS,
        paddle_human_x,
        paddle_human_x + PADDLE_WIDTH,
        ball_y,
        ball_y + BALL_RADIUS,
        paddle_human_y,
        paddle_human_y + PADDLE_HEIGHT
      )
    ) {
      ball_velocity_y = -((PADDLE_HEIGHT / 2 + (paddle_human_y - ball_y)) / 5);
      if (ball_velocity_y > ball_max_velocity * 0.7) {
        ball_velocity_y = ball_max_velocity * 0.7;
      }
      if (ball_velocity_y < -(ball_max_velocity * 0.7)) {
        ball_velocity_y = -(ball_max_velocity * 0.7);
      }
      ball_velocity_x = Math.sqrt(Math.pow(ball_max_velocity, 2) - Math.pow(ball_velocity_y, 2));

      if (!cpu_player) ball_max_velocity += 0.5;

      play_sample(pong, 255, 1000, 0);

      ball_velocity_x = -ball_velocity_x;
    }

    if (
      collision(
        ball_x,
        ball_x + BALL_RADIUS,
        paddle_cpu_x,
        paddle_cpu_x + PADDLE_WIDTH,
        ball_y,
        ball_y + BALL_RADIUS,
        paddle_cpu_y,
        paddle_cpu_y + PADDLE_HEIGHT
      )
    ) {
      ball_velocity_y = -((PADDLE_HEIGHT / 2 + (paddle_cpu_y - ball_y)) / 5);
      if (ball_velocity_y > ball_max_velocity * 0.7) {
        ball_velocity_y = ball_max_velocity * 0.7;
      }
      if (ball_velocity_y < -(ball_max_velocity * 0.7)) {
        ball_velocity_y = -(ball_max_velocity * 0.7);
      }
      ball_velocity_x = Math.sqrt(Math.pow(ball_max_velocity, 2) - Math.pow(ball_velocity_y, 2));
      play_sample(pong, 255, 1000, 0);
      if (!cpu_player) ball_max_velocity += 0.5;
    }
    if (human_score > 99) human_score = 99;
    if (cpu_score > 99) cpu_score = 99;
  }
  if (game_state === 0) {
    if (key[KEY_1]) game_state = 1;
    if (key[KEY_2]) {
      game_state = 1;
      cpu_player = false;
    }
  }
}

function setup() {
  pong = load_sample("assets/audio/pong.wav");
  die = load_sample("assets/audio/die.wav");
  win = load_sample("assets/audio/win.wav");
}

function main() {
  enable_debug("debug");
  allegro_init_all("game-canvas", 960, 720);

  setup();
  ready(function () {
    loop(function () {
      clear_to_color(canvas, makecol(0, 0, 0));
      update();
      draw();
    }, BPS_TO_TIMER(60));
  });
  return 0;
}
END_OF_MAIN(main);
