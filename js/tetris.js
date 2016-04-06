
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {

    $scope.oynanma = 0;
    $scope.deneme = 0;
    var test = function () {
        yeniOyun();
        setInterval(render, 30);
        artir($scope.oynanma);
    };
    $scope.test = test;

    var artir = function(deneme){
        $scope.oynanma = $scope.oynanma + 1;
    }
    $scope.artir = artir;
    
    var SUTUN = 10, SATIR = 20;
    var board = [];
    var kaybetti;
    var interval;
    var secili; // Şimdiki Şekil.
    var seciliX, seciliY,h; // Şeklin Şimdiki Hizalama Komutları.
    var sekils = [   //Varolan şekiller bu şekilde ifade ediliyor.   
        [1, 1, 1, 1],
        [1, 0, 1, 0,
        1, 1, 1, 0,
        1, 0, 1],
        [1, 1, 1, 0,
          1],
        [1, 1, 1, 0,
          0, 0, 1],
        [1, 1, 0, 0,
          1, 1],
        [1, 1, 0, 0,
          0, 1, 1],
        [0, 1, 1, 0,
          1, 1],

    ];
    var colors = [  //Burada Şekillere renkler veriliyor.
        'black', 'orange', 'blue', 'turquoise', 'red', 'green', 'purple'
    ];

    // 4*4 boyutunda şekil üretiyor bize.
    var yeniSekil = function(){
        var id = Math.floor(Math.random() * sekils.length);
        var sekil = sekils[id]; 

        secili = [];
        for (var y = 0; y < 4; ++y) {
            secili[y] = [];
            for (var x = 0; x < 4; ++x) {
                var i = 4 * y + x;
                if (typeof sekil[i] != 'undefined' && sekil[i]) {
                    secili[y][x] = id + 1;
                }
                else {
                    secili[y][x] = 0;
                }
            }
        }
        // şeklin pozisyonu ayarlaniyor.
        seciliX = 5;
        seciliY = 0;
    }

    // Ekranı temizleyen kısım.
    var init= function() {
        for (var y = 0; y < SATIR; ++y) {
            board[y] = [];
            for (var x = 0; x < SUTUN; ++x) {
                board[y][x] = 0;
            }
        }
    }

    // Çizgiler aşağı inerken yeni şkil oluşturma.
    var  tick= function(hakan) {
        
        if (valid(0, 1)) {
            ++seciliY;
        }
            // eleman set edilmişse.
        else {
            dondur();
            satirSil();
            if (kaybetti) {
        
               yeniOyun();// Eğer kaybettiysen yeni oyun aciliyor. 
              
              return false;
            }
            yeniSekil();
        }
    }

    
    // Şekli son konumunda durduran kısım.
    var dondur=function() {
        for (var y = 0; y < 4; ++y) {
            for (var x = 0; x < 4; ++x) {
                if (secili[y][x]) {
                    board[y + seciliY][x + seciliX] = secili[y][x];
                }
            }
        }
    }

    // Saat yönünün terine şekli dööndüren kısım.
    var rotate = function (secili) {
        var yeniSecilen = [];
        for (var y = 0; y < 4; ++y) {
            yeniSecilen[y] = [];
            for (var x = 0; x < 4; ++x) {
                yeniSecilen[y][x] = secili[3 - x][y];
            }
        }

        return yeniSecilen;
    }
    $scope.score = 0;
    // Eğer oyun başarılı ise yani satır dolu ise dolduran kısım.
    var satirSil = function () {
        for (var y = SATIR - 1; y >= 0; --y) {
            var satirBulundu = true;
            for (var x = 0; x < SUTUN; ++x) {
                if (board[y][x] == 0) {
                    satirBulundu = false;
                    break;
                }
            }
            if (satirBulundu) {
                //Silinecek satirlar.
                for (var yy = y; yy > 0; --yy) {
                    for (var x = 0; x < SUTUN; ++x) {
                        board[yy][x] = board[yy - 1][x];
                    }
                   
                   
                }
                $scope.$apply(function () {
                    $scope.score++;
                });
                ++y;
            }
        }
    }

    var keyPress = function (key) {
        switch (key) {
            case 'left':
                if (valid(-1)) {
                    --seciliX;
                }
                break;
            case 'right':
                if (valid(1)) {
                    ++seciliX;
                }
                break;
            case 'down':
                if (valid(0, 1)) {
                    ++seciliY;
                }
                break;
            case 'rotate':
                var rotated = rotate(secili);
                if (valid(0, 0, rotated)) {
                    secili = rotated;
                }
                break;
        }
    }

    // Şeçili şeklin o halini korumasını sağlaan fonksiyon.
    var valid = function (offsetX, offsetY, yeniSecilen) {
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;
        offsetX = seciliX + offsetX;
        offsetY = seciliY + offsetY;
        yeniSecilen = yeniSecilen || secili;



        for (var y = 0; y < 4; ++y) {
            for (var x = 0; x < 4; ++x) {
                if (yeniSecilen[y][x]) {
                    if (typeof board[y + offsetY] == 'undefined'
                      || typeof board[y + offsetY][x + offsetX] == 'undefined'
                      || board[y + offsetY][x + offsetX]
                      || x + offsetX < 0
                      || y + offsetY >= SATIR
                      || x + offsetX >= SUTUN) {
                        if (offsetY == 1) kaybetti = true; // Eger tepeye uşatıysa şekil oyunu kaybettin demektir.
                        return false;
                    }
                }
            }
        }
        return true;
    }

    //Yeni oyunu başlatsan kısım.
     var yeniOyun=function() {
         clearInterval(interval);
         $scope.$apply(function () {
             $scope.score=0;
         });
        init();
        yeniSekil();
        kaybetti = false;
        interval = setInterval(tick, 250);
    }

    yeniOyun();

    var canvas = document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext('2d');
    var W = 300, H = 600;
    var BLOCK_W = W / SUTUN, BLOCK_H = H / SATIR;

    // Şekilleri ekrana çizen metotlar.
    var drawBlock = function (x, y) {
        ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
        ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
    }

   
    //Boardı yani tahyatı oluşturan ksıımlar.
    var render = function () {
        ctx.clearRect(0, 0, W, H);

        ctx.strokeStyle = 'black';
        for (var x = 0; x < SUTUN; ++x) {
            for (var y = 0; y < SATIR; ++y) {
                if (board[y][x]) {
                    ctx.fillStyle = colors[board[y][x] - 1];
                    drawBlock(x, y);
                }
            }
        }

        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'black';
        for (var y = 0; y < 4; ++y) {
            for (var x = 0; x < 4; ++x) {
                if (secili[y][x]) {
                    ctx.fillStyle = colors[secili[y][x] - 1];
                    drawBlock(seciliX + x, seciliY + y);
                }
            }
        }
    }

    //Hangi tuş kombinasyonları ile oynanacağını belirliyoruz.
    document.body.onkeydown = function (e) {
        var keys = {
            65: 'left',
            68: 'right',
            83: 'down',
            87: 'rotate'
        };
        if (typeof keys[e.keyCode] != 'undefined') {
            keyPress(keys[e.keyCode]);
            render();
        }
    };
   




});



