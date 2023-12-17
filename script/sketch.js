let pandas = [];
let overAllTexture;
let shakingMagnitude = 5; // 판다가 떨릴 강도

class Panda {
  constructor(args) {
    let def = {
      p: createVector(width / 2, height / 2),
      randomId: random(500),
      size: createVector(random(120, 150), random(90, 120)),
      colors: this.generatePandaColors(),
      eyeSizes: createVector(random(20, 30), random(20, 30)),
      ang: random(-0.1, 0.1),
      earSize: createVector(random(30, 50), random(30, 50)),
      numEars: 3,
      pupilSize: createVector(8, 8),
      eyePatchSize: createVector(10, 10), // 더 어두운 회색 아이패치
      whiteEyeSize: createVector(14, 14),
      mouthSize: createVector(30, 10),
      mouthType: floor(random(3)), // 0, 1, 2 중 하나의 입 모양을 랜덤 선택
      v: createVector(0, 0), // 속도 벡터
    };
    Object.assign(def, args);
    Object.assign(this, def);

    // 새로운 속성 추가
    this.eyePosLeft = createVector(-15, -5); // 아이패치 위에 위치
    this.eyePosRight = createVector(15, -5); // 아이패치 위에 위치
    this.whiteEyePosLeft = createVector(-15, -5); // 하얀색 눈알 위치
    this.whiteEyePosRight = createVector(15, -5); // 하얀색 눈알 위치
  }

  generatePandaColors() {
    // 흰색 얼굴, 까만 귀, 회색 계열의 랜덤한 색상 생성
    let faceColor = color(random(200, 255));
    let earColor = color(random(30, 50));
    let eyePatchColor = color(random(40, 70));

    return [
      faceColor,
      earColor,
      eyePatchColor,
      color(255),
      color(0),
      color(random(150, 200)),
      color(random(150, 200)),
    ];
  }

  shake() {
    const shakingAmount = map(
      dist(this.p.x, this.p.y, mouseX, mouseY),
      0,
      width,
      0,
      shakingMagnitude
    );
    this.p.x += random(-shakingAmount, shakingAmount);
    this.p.y += random(-shakingAmount, shakingAmount);
  }

  update() {
    // 판다의 위치를 업데이트하고 떨림 효과를 적용합니다.
    this.p.add(this.v);
    this.shake();

    this.eyePosLeft.x = lerp(
      this.eyePosLeft.x,
      -15 + map(mouseX, 0, width, -5, 5),
      0.1
    );
    this.eyePosLeft.y = lerp(
      this.eyePosLeft.y,
      -5 + map(mouseY, 0, height, -5, 5),
      0.1
    );

    this.eyePosRight.x = lerp(
      this.eyePosRight.x,
      15 + map(mouseX, 0, width, -5, 5),
      0.1
    );
    this.eyePosRight.y = lerp(
      this.eyePosRight.y,
      -5 + map(mouseY, 0, height, -5, 5),
      0.1
    );

    this.whiteEyePosLeft.x = lerp(
      this.whiteEyePosLeft.x,
      -15 + map(mouseX, 0, width, -3, 3),
      0.1
    );
    this.whiteEyePosLeft.y = lerp(
      this.whiteEyePosLeft.y,
      -5 + map(mouseY, 0, height, -3, 3),
      0.1
    );

    this.whiteEyePosRight.x = lerp(
      this.whiteEyePosRight.x,
      15 + map(mouseX, 0, width, -3, 3),
      0.1
    );
    this.whiteEyePosRight.y = lerp(
      this.whiteEyePosRight.y,
      -5 + map(mouseY, 0, height, -3, 3),
      0.1
    );
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    scale(0.95);
    rotate(
      this.ang +
        sin(
          this.randomId + mouseX / 100 + frameCount / 50 + this.p.x + this.p.y
        ) /
          4
    );

    rectMode(CENTER);
    ellipseMode(CENTER);
    noStroke();

    // Draw body (흰색 얼굴)
    fill(this.colors[0]);
    ellipse(0, 0, this.size.x, this.size.y);

    // Draw eye patches (더 어두운 회색 아이패치)
    fill(this.colors[2]); // 어두운 회색
    ellipse(
      -15,
      -5,
      this.eyeSizes.x + this.eyePatchSize.x,
      this.eyeSizes.y + this.eyePatchSize.y
    );
    ellipse(
      15,
      -5,
      this.eyeSizes.x + this.eyePatchSize.x,
      this.eyeSizes.y + this.eyePatchSize.y
    );

    // Draw eyes (하얀색 눈알)
    fill(this.colors[3]);
    ellipse(
      this.whiteEyePosLeft.x,
      this.whiteEyePosLeft.y,
      this.whiteEyeSize.x
    );
    ellipse(
      this.whiteEyePosRight.x,
      this.whiteEyePosRight.y,
      this.whiteEyeSize.x
    );

    // Draw eye pupils (검정색 눈동자)
    fill(this.colors[4]);
    ellipse(
      this.eyePosLeft.x,
      this.eyePosLeft.y,
      this.pupilSize.x,
      this.pupilSize.y
    );
    ellipse(
      this.eyePosRight.x,
      this.eyePosRight.y,
      this.pupilSize.x,
      this.pupilSize.y
    );

    // Draw mouth
    fill(this.colors[5]);
    this.drawMouth();

    // Draw ears (까만 귀)
    fill(this.colors[1]);
    for (let i = 0; i < this.numEars; i++) {
      if (i !== 1) {
        let earX = map(
          i,
          0,
          this.numEars - 1,
          -this.size.x / 2,
          this.size.x / 2
        );
        ellipse(earX, -this.size.y / 2, this.earSize.x, this.earSize.y);
      }
    }

    // Draw nose
    fill(this.colors[2]);
    ellipse(0, this.size.y / 8, 15, 15);

    pop();
  }

  drawMouth() {
    // 입 모양 그리기
    switch (this.mouthType) {
      case 0:
        // 삼각형 모양
        beginShape();
        vertex(-this.mouthSize.x / 2, this.size.y / 4);
        vertex(0, this.size.y / 4 + this.mouthSize.y);
        vertex(this.mouthSize.x / 2, this.size.y / 4);
        endShape(CLOSE);
        break;
      case 1:
        // 원 모양
        ellipse(
          0,
          this.size.y / 4 + this.mouthSize.y / 2,
          this.mouthSize.x,
          this.mouthSize.y
        );
        break;
      case 2:
        // 눈물 모양
        beginShape();
        vertex(-this.mouthSize.x / 2, this.size.y / 4);
        bezierVertex(
          -this.mouthSize.x / 4,
          this.size.y / 4 - this.mouthSize.y / 2,
          this.mouthSize.x / 4,
          this.size.y / 4 - this.mouthSize.y / 2,
          this.mouthSize.x / 2,
          this.size.y / 4
        );
        endShape();
        break;
      default:
        break;
    }
  }
}

function addPanda(x, y) {
  pandas.push(new Panda({ p: createVector(x, y) }));
}

function updatePandaPositions() {
  for (let i = 0; i < pandas.length; i++) {
    let x = map(i % 4, 0, 3, width / 8, width - width / 8);
    let y = map(floor(i / 4), 0, 3, height / 8, height - height / 8);
    pandas[i].p.set(x, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updatePandaPositions();

  // 창 크기가 변경되면 텍스처도 다시 생성합니다.
  overAllTexture = createGraphics(width, height);
  overAllTexture.loadPixels();
  for (let i = 0; i < width + 50; i++) {
    for (let o = 0; o < height + 50; o++) {
      overAllTexture.set(
        i,
        o,
        color(100, noise(i / 3, o / 3, (i * o) / 50) * random([0, 50, 100]))
      );
    }
  }
  overAllTexture.updatePixels();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  overAllTexture = createGraphics(width, height);
  overAllTexture.loadPixels();
  for (let i = 0; i < width + 50; i++) {
    for (let o = 0; o < height + 50; o++) {
      overAllTexture.set(
        i,
        o,
        color(100, noise(i / 3, o / 3, (i * o) / 50) * random([0, 50, 100]))
      );
    }
  }
  overAllTexture.updatePixels();

  for (let x = width / 8; x < width; x += width / 4) {
    for (let y = height / 8; y < height; y += height / 4) {
      addPanda(x, y);
    }
  }
}

function draw() {
  fill(255);
  rect(0, 0, width, height);
  pandas.forEach((panda) => {
    panda.draw();
  });

  push();
  blendMode(MULTIPLY);
  image(overAllTexture, 0, 0);
  pop();
}

function mouseMoved() {
  pandas.forEach((panda) => {
    panda.update();
  });
}

function mousePressed() {
  addPanda(mouseX, mouseY);
}

function mouseReleased() {
  pandas.forEach((panda) => {
    panda.v = createVector(0, 0);
  });
}
