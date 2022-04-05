class Dam {
    elemNodes = new Array();
    nodes = new Array();
    bc = new Array();

    constructor() {
    }

    init() {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
    }

    read(ourRequest) {
        let ourData = ourRequest.responseText;
        //console.log(ourData);

        let strBlocks = ourData.split('@');

        //console.log(strBlocks[2]);

        let newStr = [
            strBlocks[0].split(','),
            strBlocks[1].split(','),
            strBlocks[2].split(',')
        ];

        //console.log(newStr[2].length);

        let nums = new Array(3);
        for (let j = 0; j < 3; j++) {
            nums[j] = new Array();
            for (let i = 0; i < newStr[j].length; i++) {
                nums[j].push(parseFloat(newStr[j][i]));
            }
        }
        //console.log(nums);

        for (let j = 0, i = 0; j < nums[0].length; j+=2, i++) {
            this.nodes.push(new Array(nums[0][j], nums[0][j + 1]));
        }
        this.nodes = TransMatrix(this.nodes);

        for (let j = 0; j < nums[1].length; j+=4) {
            this.elemNodes.push(new Array(nums[1][j], nums[1][j + 1], nums[1][j + 2], nums[1][j + 3]));
        }
        this.elemNodes = TransMatrix(this.elemNodes);

        for (let j = 0, i = 0; j < nums[2].length / 2; j++, i++) {
            this.bc.push(new Array(nums[2][j], nums[2][j + nums[2].length / 2]));
        }
        this.bc = TransMatrix(this.bc);
        //console.log(this);
    }
  
    draw(T) {
        canvas.width = 500;
        canvas.height = 500;
        
        ctx.fillStyle = "green";
        
        ctx.beginPath();
  
        //ctx.moveTo(0, 0);
        //console.log(this.coords);
        for (let i = 0; i < this.coords.length; i++) {
              this.coords[i].x *= 5;
              this.coords[i].y *= 5;
              ctx.moveTo(this.coords[i].x + 200, this.coords[i].y + 200);
              ctx.arc(this.coords[i].x + 200, this.coords[i].y + 200, 5, 0, Math.PI * 2, true);
        }
        //console.log(this.coords);
        
        ctx.fill();
    }

    solve() {
        let nodeLength = this.nodes[0].length;    
        let K = new Array(nodeLength);
        let R;

        for (let i = 0; i < K.length; i++) {
            K[i] = new Array(nodeLength);
            for (let j = 0; j < K[0].length; j++) {
                K[i][j] = 0;
            }
        }


        for (let i = 0; i < this.elemNodes[0].length; i++) {
            var elem_n_lock = [1, 2, 3];
            elem_n_lock[0] = this.elemNodes[0][i];
            elem_n_lock[1] = this.elemNodes[1][i];
            elem_n_lock[2] = this.elemNodes[2][i];
        
            R = [1, 2, 3];
            for (let i = 0; i < 3; i++) {
                R[i] = new Array(this.nodes[0][elem_n_lock[i] - 1], this.nodes[1][elem_n_lock[i] - 1]);
            }
            R = TransMatrix(R);
            
            let Ki = getStifnessMatrix(R, this.elemNodes[3][i]);
            Ki = trsMatrix(nodeLength, elem_n_lock, Ki);
            K = SumMatrix(K, Ki);
        }

        var F = new Array(nodeLength);

        for (let i = 0; i < F.length; i++) {
            F[i] = 0;
        }

        for (let i = 0; i < this.bc[0].length; i++) {
            for (let j = 0; j < K[0].length; j++) {
                K[this.bc[0][i] - 1][j] = 0;
            }
            K[this.bc[0][i] - 1][this.bc[0][i] - 1] = 1;            
            F[this.bc[0][i] - 1] = this.bc[1][i];
        }

        return MultiplyMatrixLineVariant(InverseMatrix(K), F);
    }
}