window.onload = function () {
    // svg element
    var svgRoot = document.getElementById("root"); // whole svg area
    var startingScreen = document.getElementById("startingScreen");
    var startTextStartingScreen = document.getElementById("startTextStartingScreen");
    var rules = document.getElementById("rules");
    var startTextRules = document.getElementById("startTextRules");
    var main = document.getElementById("main");
    var upgradeMessage = document.getElementById("upgradeMessage");
    var endGameScreen = document.getElementById("endGame");

    // two hammers
    var basicHammer = document.getElementById("basicHammer");
    var badassHammer = document.getElementById("badassHammer");

    // score related and its element
    var score = 0; // store totalScore
    var moleHit = 0;
    var helmetedHit = 0;
    var rabbitHit = 0;
    var mainGameScore = document.getElementById("score"); // text elem for in game score
    var endGameScore = document.getElementById("endGameScore"); // text elem for end game score
    var endGameMoleHit = document.getElementById("endGameMoleHit");
    var endGameHelmetedHit = document.getElementById("endGameHelmetedHit");
    var endGameRabbitHit = document.getElementById("endGameRabbitHit");
    var endGameGrading = document.getElementById("endGameGrading"); // text elem for grading
    var endGameGradingShade = document.getElementById("endGameGradingShade"); // text elem for the shadow of grading


    // time and its element
    var totalTime = 60;
    var time = document.getElementById("time");
    var holePos = [[320, 1050], [790, 900], [780, 1200],
        [1280, 750], [1280, 1060], [1280, 1330],
        [1750, 900], [1760, 1190], [2200, 1050]];

    // all monsters
    var mole = document.getElementById("mole");
    var helmetedMole = document.getElementById("helmetedMole");
    var rabbit = document.getElementById("rabbit");

    // If starting text from starting screen is clicked, jump to the rules
    startTextStartingScreen.addEventListener("mousedown", function () {
        playMenuClick();

        // switching from main menu to rules screen
        startingScreen.setAttribute("visibility", "hidden");
        rules.setAttribute("visibility", "visible");

        // If starting text form rules is clicked, jump to the main game
        startTextRules.addEventListener("mousedown", function () {
            playMenuClick();
            playBgm();

            // switching from rules to actual game
            rules.setAttribute("visibility", "hidden");
            main.setAttribute("visibility", "visible");

            // hammer cursor
            svgRoot.addEventListener("mousemove", function cursor(evt) {
                if (totalTime <= 30) { // when remaining time <= 30 switch the BADASS hammer
                    svgRoot.addEventListener("mousemove", function (evt) {
                        basicHammer.setAttribute("visibility", "hidden"); // hide the basic one
                        const x = evt.clientX - 50;
                        const y = evt.clientY - 250;
                        var translateText = getTranslateText(x, y);
                        var scaleText = "scale(0.5 0.5)";
                        var rotateText = "rotate(10)";
                        var transformText = translateText + " " + scaleText + " " + rotateText;
                        badassHammer.setAttribute("transform", transformText);
                        badassHammer.setAttribute("visibility", "visible");

                        // show the message of how to use the new hammer and remove old listener
                        upgradeMessage.setAttribute("visibility", "visible");
                        this.removeEventListener("mousemove", cursor);

                    });
                }

                // using the basic hammer
                const x = evt.clientX - 50;
                const y = evt.clientY - 250;
                var translateText = getTranslateText(x, y);
                var scaleText = "scale(0.5 0.5)";
                var rotateText = "rotate(10)";
                var transformText = translateText + " " + scaleText + " " + rotateText;
                basicHammer.setAttribute("transform", transformText);
                basicHammer.setAttribute("visibility", "visible");


            });

            var timer = setInterval(function () {
                if (totalTime <= 10) { // if 10 seconds left, play clock music
                    playClock();
                }
                if (totalTime < 0) { // time's up
                    pauseBgm();
                    pauseClock();
                    playEndGameBgm();

                    // stop the timer and stop spawning monsters
                    clearInterval(timer);
                    clearInterval(spawner);

                    // hide all monster
                    mole.setAttribute("visibility", "hidden");
                    helmetedMole.setAttribute("visibility", "hidden");
                    rabbit.setAttribute("visibility", "hidden");

                    // switching to end game screen
                    main.setAttribute("visibility", "hidden");
                    endGameScreen.setAttribute("visibility", "visible");
                    badassHammer.setAttribute("visibility", "hidden");

                    // update final score and hit for each monster
                    endGameScore.textContent = score;
                    endGameMoleHit.textContent = moleHit;
                    endGameHelmetedHit.textContent = helmetedHit;
                    endGameRabbitHit.textContent = rabbitHit;

                    // grading
                    if (score >= 90) {
                        endGameGrading.textContent = "A";
                        endGameGradingShade.textContent = "A";
                    } else if (score >= 50) {
                        endGameGrading.textContent = "B";
                        endGameGradingShade.textContent = "B";
                    } else {
                        endGameGrading.textContent = "C";
                        endGameGradingShade.textContent = "C";
                    }


                } else { // update timer
                    time.textContent = totalTime.toString();
                    totalTime--;
                }
            }, 1000);

            var spawner = setInterval(spawnMonster, 2000);


        });
    });

    // TESTING
    // var i = 7;
    // helmetedMole.setAttribute("visibility", "visible");
    // var scaleText = "scale(0.5 0.5)";
    // var translateText = "translate(" + holePos[i][0] + " " + holePos[i][1] + ")";
    // helmetedMole.setAttribute("transform", scaleText + " " + translateText);


    function spawnMonster() {
        // alert("Spawn Monster called");
        var scaleText = "scale(0.5 0.5)";

        // three positions for each monster
        var posIndex1 = Math.floor(Math.random() * holePos.length);
        var posIndex2;
        var posIndex3;
        var translateText = getTranslateText(holePos[posIndex1][0], holePos[posIndex1][1]);

        mole.setAttribute("transform", scaleText + " " + translateText);
        mole.addEventListener("mousedown", moleListener);
        mole.setAttribute("visibility", "visible");

        do { // avoid appear in same hole
            posIndex2 = Math.floor(Math.random() * holePos.length);
        } while (posIndex2 === posIndex1);
        translateText = getTranslateText(holePos[posIndex2][0], holePos[posIndex2][1]);
        helmetedMole.setAttribute("transform", scaleText + " " + translateText);
        // switch listener for BADASS hammer
        if (totalTime >= 30) helmetedMole.addEventListener("dblclick", helmetedMoleListenerWithBasicHammer);
        else helmetedMole.addEventListener("mousedown", helmetedMoleListenerWithBadassHammer);
        helmetedMole.setAttribute("visibility", "visible");

        do { // avoid appear in same hole
            posIndex3 = Math.floor(Math.random() * holePos.length);
        } while (posIndex3 === posIndex1 || posIndex3 === posIndex2);
        translateText = getTranslateText(holePos[posIndex3][0], holePos[posIndex3][1]);
        rabbit.setAttribute("transform", scaleText + " " + translateText);
        rabbit.addEventListener("mousedown", rabbitListener);
        rabbit.setAttribute("visibility", "visible");

        // if (totalTime > 0) {
        //     spawnner = setTimeout(spawnMonster(), 3000);
        // }
    }

    // return translate text with coords provided
    function getTranslateText(x, y) {
        return "translate(" + x + " " + y + ")";
    }


    function moleListener() {
        if (totalTime > 30) playWhack();
        else playMetalWhack();
        playMoleNoise();

        score++;
        moleHit++;
        updateScore();
        mole.setAttribute("visibility", "hidden");
        mole.removeEventListener("mousedown", moleListener);
    }

    function helmetedMoleListenerWithBasicHammer() {
        if (totalTime > 30) playWhack();
        else playMetalWhack();
        playHelmetHit();
        playMoleNoise();

        score += 2;
        helmetedHit++;
        updateScore();
        helmetedMole.setAttribute("visibility", "hidden");
        helmetedMole.removeEventListener("dblclick", helmetedMoleListenerWithBasicHammer);

    }

    function helmetedMoleListenerWithBadassHammer() {
        if (totalTime > 30) playWhack();
        else playMetalWhack();
        playHelmetHit();
        playMoleNoise();

        score += 2;
        helmetedHit++;
        updateScore();
        helmetedMole.setAttribute("visibility", "hidden");
        helmetedMole.removeEventListener("mousedown", helmetedMoleListenerWithBasicHammer);
    }

    function rabbitListener() {
        if (totalTime > 30) playWhack();
        else playMetalWhack();
        playScream();

        score--;
        rabbitHit++;
        updateScore();
        rabbit.setAttribute("visibility", "hidden");
        rabbit.removeEventListener("mousedown", rabbitListener);
    }


    function updateScore() {
        mainGameScore.textContent = score.toString();
    }


    function playMenuClick() {
        document.getElementById("soundClick").play();
    }

    function playWhack() {
        document.getElementById("soundWhack").play();
    }

    function playMetalWhack() {
        document.getElementById("soundWhackMetal").play();
    }

    function playMoleNoise() {
        document.getElementById("soundMole").play();
    }

    function playClock() {
        document.getElementById("soundClock").play();
    }

    function pauseClock() {
        document.getElementById("soundClock").pause();
    }

    function playHelmetHit() {
        document.getElementById("soundHelmetHit").play();
    }

    function playScream() {
        document.getElementById("soundScream").play();
    }

    function playBgm() {
        document.getElementById("bgm").play();
    }

    function pauseBgm() {
        document.getElementById("bgm").pause();
    }

    function playEndGameBgm() {
        document.getElementById("endGameBgm").play();
    }
};
