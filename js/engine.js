function square(number)
{
	return number * number;
}

function detect_collision()
{
	for(i=0;i<sprites.length;i++)
	{
		for(j=i+1;j<sprites.length;j++)
		{
			ri = sprites[i];
			rj = sprites[j];
			if(ball_dist(ri, rj) < ri.w + 10)
			{
				if(i==0 && window.gamestate == "started")
				{
					window.gamestate = "gameover";
					window.gravity = 0.05;
				}
				else if(window.gamestate == "started")
				{
					resolve_colliding(ri, rj);
				}
				else if(window.gamestate == "gameover")
				{
					resolve_colliding(ri, rj);
				}
			}
		}
	}
}

function moveRed()
{
	if(window.gamestate != "started")
	{
		return;
	}

	for(i =1; i<sprites.length; i++)
	{
		rball = sprites[i];
		x = rball.cx() + rball.vx * rball.sp;
		y = rball.cy() + rball.vy * rball.sp;
		right = (rball.w / 2) + x;
		left = x - (rball.w / 2);
		ytop = y - (rball.h / 2);
		bottom = y + (rball.h / 2);

		if(right > canvas.width)
		{
			diff = right - canvas.width;
			rball.vx *= -1;
			x -= diff;
		}
		else if(left < 0)
		{
			diff = 0 - left;
			rball.vx *= -1;
			x += diff;
		}
		else if(bottom > canvas.height)
		{
			diff = bottom - canvas.height;
			rball.vy *= -1;
			y -= diff;
		}
		else if(ytop < 0)
		{
			diff = 0 - ytop;
			rball.vy *= -1;
			y += diff;
		}
		rball.setx(x);
		rball.sety(y);
	}
	detect_collision();
}

function falldown()
{
	if(window.gamestate != "gameover")
	{
	return ;
	}

	for(i =0; i<sprites.length; i++)
	{
		ball = sprites[i];
		ball.vy += window.gravity;
		x = ball.cx() + ball.vx * ball.sp;
		y = ball.cy() + ball.vy * ball.sp;
		right = (ball.w / 2) + x;
		left = x - (ball.w / 2);
		ytop = y - (ball.h / 2);
		bottom = y + (ball.h / 2);

		if(right > canvas.width)
		{
			diff = right - canvas.width;
			ball.vx *= -0.2;
			x -= diff;
		}
		else if(left < 0)
		{
			diff = 0 - left;
			ball.vx *= -0.2;
			x += diff;
		}
		else if(bottom > canvas.height)
		{
			diff = bottom - canvas.height;
			ball.vy *= -0.6;
			y -= diff;
		}
		else if(ytop < 0)
		{
			diff = 0 - ytop;
			ball.vy *= -1;
			y += diff;
		}
		ball.setx(x);
		ball.sety(y);
	}
	detect_collision();
}

function ball_dist(i, j)
{
	var x1 = i.cx();
	var y1 = i.cy();
	var x2 = j.cx();
	var y2 = j.cy();
	return Math.sqrt(square(x1 - x2) + square(y1 - y2));
}

function resolve_colliding(b1, b2)
{
	var dist = ball_dist(b1, b2);
	if( dist > b1.w)
	{
		return ;
	}
	else if(dist < b1.w)
	{
		b1.vx *= -1;
		b1.vy *= -1;
		b2.vx *= -1;
		b2.vx *= -1;
		checkOverlap(b1, b2);
		b1.vx *= -1;
		b1.vy *= -1;
		b2.vx *= -1;
		b2.vx *= -1;
	}
	var v1 = Object.create(vector);
	v1.setxy(b1.vx, b1.vy);

	var v2 = Object.create(vector);
	v2.setxy(b2.vx, b2.vy);

	var un = Object.create(vector);
	un.setxy(b1.cx() - b2.cx(), b1.cy() - b2.cy());

	un.unit_vector();

	var ut = Object.create(vector);
	ut.setxy(-1*un.vy, un.vx);

	var v1n = v1.dot_vector(un);
	var v2n = v2.dot_vector(un);
	var v1t = v1.dot_vector(ut);
	var v2t = v2.dot_vector(ut);

	var temp = v1n;
	v1n = v2n;
	v2n = temp;

	var new_v1n = Object.create(vector);
	new_v1n.scalar_vector(v1n, un);

	var new_v1t = Object.create(vector);
	new_v1t.scalar_vector(v1n, ut);

	var new_v2n = Object.create(vector);
	new_v2n.scalar_vector(v2n, un);

	var new_v2t = Object.create(vector);
	new_v2t.scalar_vector(v2t, ut);

	v1.add_vector(new_v1n, new_v1t);
	v2.add_vector(new_v2n, new_v2t)

	b1.vx = v1.vx;
	b1.vy = v1.vy;
	b2.vx = v2.vx;
	b2.vy = v2.vy;

	checkOverlap(b1, b2);
}

function checkOverlap (b1, b2)
{
	b1.setx(b1.cx() + b1.vx * b1.sp);
	b1.sety(b1.cy() + b1.vy * b1.sp);
	b2.setx(b2.cx() + b2.vx * b2.sp);
	b2.sety(b2.cy() + b2.vy * b2.sp);

	if(ball_dist(b1, b2) <= (b1.w / 2))
	{
		checkOverlap(b1, b2);
	}
	else
	{
		return;
	}
}

function update()
{
	if(window.gamestate == "started" || window.gamestate == "starting")
	{
		moveRed();
		window.requestAnimationFrame(update, canvas);
		render();
	}
	else if(window.gamestate == "gameover")
	{
		falldown();
		window.requestAnimationFrame(update, canvas);
		render();
	}
}

function render()
{
	if(window.count < 2000 && window.gamestate == "started")
	{
		window.count++;
	}
	else if(window.gamestate == "started")
	{
		add_ball_sprite(200, 200, 0);
		window.count = 0;
		window.gameScore++;
	}
    
	surface.clearRect(0, 0, canvas.width, canvas.height);
    
	if(sprites.length !== 0)
	{
		for(var i = 0; i < sprites.length; i++)
		{
			if(i==0)
			{
				var rgbColor = "rgb(0, 0, 255)";
				drawCircle(sprites[i].cx(), sprites[i].cy(), sprites[i].w / 2, rgbColor);
			}
			else
			{
				var rgbColor = "rgb(255, 0, 0)";
				drawCircle(sprites[i].cx(), sprites[i].cy(), sprites[i].w / 2, rgbColor);
			}
		}
	}
}

function drawCircle(x, y, radius, color)
{
	surface.fillStyle = color;
	surface.beginPath();
	surface.arc(x, y, radius, 0, Math.PI*2, true);
	surface.closePath();
	surface.fill();
}

function move(mousex, mousey)
{
	sprites[0].setx(mousex);
	sprites[0].sety(mousey);
}

function mousemoveHandle(event)
{
	mouseX = event.pageX - canvas.offsetLeft;
	mouseY = event.pageY - canvas.offsetTop;
    
	if(window.gamestate == "started" || window.gamestate == "starting")
	{
		move(mouseX, mouseY);
	}
}

function loadImage()
{
	update();
}

function gameStart()
{
	update();
	setTimeout(function(){
		window.gamestate = "started";
	}, 2000);
}

function add_ball_sprite(x, y, i)
{
	objBall = Object.create(sprite);
	objBall.setx(Math.random() * 200 + x);
	objBall.sety(Math.random() * 200 + y);
	objBall.vx = 1;
	objBall.vy = 1;
	if(i==0)
	{
		objBall.vx = 0;
		objBall.vy = 0;
		setTimeout(function(){
			sprites[sprites.length - 1].vx = 1;
			sprites[sprites.length - 1].vy = 1;
		}, 1000);
	}
	sprites.push(objBall);
}

var vector =
{
	vx: 0,
	vy: 0,
	mag: 0,
	add_vector: function(vector, vector1)
	{
		this.setxy(vector.vx + vector1.vx, vector.vy + vector1.vy);
	},
	dot_vector: function(vector)
	{
		return this.vx * vector.vx + this.vy * vector.vy;
	},
	scalar_vector: function(scalar, vector)
	{
		this.setxy(scalar*vector.vx, scalar*vector.vy);
	},
	setxy: function(x, y)
	{
		this.vx = x;
		this.vy = y;
		this.mag = Math.sqrt(square(x) + square(y));
	},
	unit_vector: function()
	{
		this.setxy(this.vx / this.mag, this.vy / this.mag);
	},
};

var sprite =
{
	x: 0,
	y: 50,
	w: 20,
	h: 20,

	vx: 0,
	vy: 0,
	sp: 2,

	cx: function()
	{
		return this.x + (this.w / 2);
	},
	cy: function()
	{
		return this.y + (this.h / 2);
	},
	left: function()
	{
		return this.x;
	},
	right: function()
	{
		return this.x + this.w;
	},
	top: function()
	{
		return this.y;
	},
	bottom: function()
	{
		return this.y + this.h;
	},

	setx: function(valx)
	{
		this.x = valx - (this.w / 2);
	},
	sety: function(valy)
	{
		this.y = valy - (this.h / 2);
	}
};

window.gamestate = "starting";
window.gameScore = 0;
window.count = 0;
window.gravity = 0.1;

canvas = document.getElementById("canvas");
canvas.style.cursor = "none";
surface = canvas.getContext("2d");

var sprites = [];

add_ball_sprite(200, 200, 1);

canvas.addEventListener("mousemove",mousemoveHandle, false);

add_ball_sprite(0, 0, 1);
add_ball_sprite(0, 200, 1);
add_ball_sprite(200, 0, 1);
add_ball_sprite(200, 200, 1);
gameStart();