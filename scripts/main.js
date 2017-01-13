$(document).ready(function() {
	var $workSession = $("#workSession");
	var $workMinus = $("#workMinus");
	var $workPlus = $("#workPlus");
	var $breakSession = $("#breakSession");
	var $breakMinus = $("#breakMinus");
	var $breakPlus = $("#breakPlus");
	var $timer = $("#timer");
	var $power = $("#power");

	var time, minutes, seconds, intervalID;
	var minutesW = 25;
	var minutesB = 5;
	var animation = false;
	var tick = new Audio ("audio/close_cigarette_lighter.mp3");
	var ring = new Audio ("audio/timer_or_desk_bell.mp3");

	// Initial animation setup
	var ctx = document.getElementById("canvas").getContext("2d");
	kitchenTimer(minutesW);

	$power.on("click", function() {
		if (animation) {
			window.clearInterval(intervalID);
			animation = false;
			$timer.text(minutesW + ":00");
			$power.text("Start!");
		} else {
			animation = "WORK";
			$power.text("Cancel~");
			digitalTimer(minutesW);
		}
	});

	$workMinus.on("click", function() {
		if (minutesW > 1 && !animation) {
			adjustTimers("W", "-");
			kitchenTimer(minutesW);
		}
	});

	$workPlus.on("click", function() {
		if (minutesW < 60 && !animation) {
			adjustTimers("W", "+");
			kitchenTimer(minutesW);
		}
	});

	$breakMinus.on("click", function() {
		if (minutesB > 1 && !animation) {
			adjustTimers("B", "-");
		}
	});

	$breakPlus.on("click", function() {
		if (minutesB < 60 && !animation) {
			adjustTimers("B", "+");
		}
	});

	function kitchenTimer(m) {
		// Clear canvas
		ctx.clearRect(0, 0, 300, 250);
		ctx.save();

		// Outline and inner circle
		ctx.save();
		ctx.fillStyle = "white";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(150, 120, 75, 0, Math.PI, true);
		ctx.lineTo(75, 200);
		ctx.lineTo(225, 200);
		ctx.lineTo(225, 120);
		ctx.fill();
		ctx.moveTo(75, 200);
		ctx.lineTo(75, 208);
		ctx.lineTo(225, 208);
		ctx.lineTo(225, 200);
		ctx.fill();
		ctx.moveTo(195, 120);
		ctx.arc(150, 120, 45, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.restore();

		// Adjust canvas
		ctx.translate(150, 120);
		ctx.rotate(Math.PI * 1.5);

		// Bold marks and numbers
		ctx.save();
		ctx.lineWidth = 3;
		for (var i = 1; i < 13; i++) {
			ctx.beginPath();
			ctx.rotate(Math.PI / 6);
			ctx.moveTo(45, 0);
			ctx.lineTo(55, 0);

			// Numbers
			ctx.save();
			ctx.translate(65, 0);
			ctx.rotate((Math.PI / -6) * i);
			ctx.rotate(Math.PI / 2);
			ctx.fillText(i * 5, -6, 4);
			ctx.restore();

			ctx.stroke();
		}
		ctx.restore();

		// Thin marks and pointer
		ctx.save();
		for (i = 0; i < 61; i++) {
			if (i % 5 !== 0) {
				ctx.beginPath();
				ctx.moveTo(45, 0);
				ctx.lineTo(50, 0);
				ctx.stroke();
			}
			if (i === m) {
				ctx.save();
				ctx.lineCap = "round";
				ctx.lineJoin = "bevel";
				ctx.beginPath();
				ctx.moveTo(-12, 0);
				ctx.lineTo(20, 0);
				ctx.stroke();
				ctx.strokeStyle = "red";
				ctx.beginPath();
				ctx.moveTo(20, 0);
				ctx.lineTo(35, 0);
				ctx.stroke();
				ctx.strokeStyle = "#BBB";
				ctx.beginPath();
				ctx.moveTo(-15, 5);
				ctx.lineTo(35, 5);
				ctx.lineTo(35, -5);
				ctx.lineTo(-15, -5);
				ctx.lineTo(-15, 5);
				ctx.stroke();
				ctx.restore();
			}
			ctx.rotate(Math.PI / 30);
		}
		ctx.restore();
		ctx.restore();
	}

	function digitalTimer(m) {
		time = m * 60;
		minutes = m;
		seconds = 0;
		intervalID = window.setInterval(function() {
			if (time >= 0) {
				if (seconds > 9) {
					if (animation === "WORK") {
						$timer.html("Work:<br>" + minutes + ":" + seconds);
					}
					if (animation === "BREAK") {
						$timer.html("Break Time!<br>" + minutes + ":" + seconds);
					}
				} else {
					if (animation === "WORK") {
						$timer.html("Work:<br>" + minutes + ":0" + seconds);
					}
					if (animation === "BREAK") {
						$timer.html("Break Time!<br>" + minutes + ":0" + seconds);
					}
				}
				if (seconds % 60 === 0) {
					minutes--;
					kitchenTimer(minutes);
				}
				if (seconds > 0) {seconds--;} else {seconds = 59;}
				time--;
			} else {
				window.clearInterval(intervalID);
				ring.play();
				if (animation === "BREAK") {
					animation = false;
					$timer.text(minutesW + ":00");
					$power.text("Start!");
				}
				if (animation === "WORK") {
					animation = "BREAK";
					kitchenTimer(minutesB);
					digitalTimer(minutesB);
				}
			}
		}, 1000);
	}

	function adjustTimers(session, adjustment) {
		switch (session) {
			case "W":
				if (adjustment === "+") {minutesW++;} else {minutesW--;}
				$workSession.text(minutesW);
				$timer.text(minutesW + ":00");
				tick.currentTime = 0;
				tick.play();
				break;
			case "B":
				if (adjustment === "+") {minutesB++;} else {minutesB--;}
				$breakSession.text(minutesB);
				break;
		}
	}
});
