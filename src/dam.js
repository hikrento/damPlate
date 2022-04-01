class Dam {

    elemNodes = new Array();
    nodes = new Array();
    bc = new Array();

    constructor(sourse) {
        this.load(sourse);
    }
    
    read(ourRequest) {
        let ourData = ourRequest.responseText;
        //console.log(ourData);

        let strBlocks = ourData.split('@');

        console.log(strBlocks[2]);

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


        console.log(this);
    }

    load(sourse) {
        var ourRequest = new XMLHttpRequest();
        ourRequest.open('GET', sourse);
        //console.log('1');
        ourRequest.onload = function() {
            //console.log(ourRequest.readyState);
            if (ourRequest.readyState == 4 && ourRequest.status == 200) {
                //console.log(2);
                dam.read(ourRequest);
            }
        };
        ourRequest.send();
    }
  
    draw() {
        canvas.width = 500;
        canvas.height = 500;
        
        ctx.fillStyle = "green";
        
        ctx.beginPath();
  
        //ctx.moveTo(0, 0);
        console.log(this.coords);
        for (let i = 0; i < this.coords.length; i++) {
              this.coords[i].x *= 5;
              this.coords[i].y *= 5;
              ctx.moveTo(this.coords[i].x + 200, this.coords[i].y + 200);
              ctx.arc(this.coords[i].x + 200, this.coords[i].y + 200, 5, 0, Math.PI * 2, true);
        }
        console.log(this.coords);
        
        ctx.fill();
    }

    trsMatrix(N, ind, Ki) {

        let Ki_new = new Array(N);
    
        for (let i = 0; i < Ki_new.length; i++) {
            Ki_new[i] = new Array(N);
        } 
    
        Ki_new[ind[0]][ind[0]] = Ki[0][0];
        
        Ki_new[ind[0]][ind[1]] = Ki[0][1];
        
        Ki_new[ind[0]][ind[2]] = Ki[0][2];
        
        Ki_new[ind[1]][ind[0]] = Ki[1][0];
        
        Ki_new[ind[1]][ind[1]] = Ki[1][1];
        
        Ki_new[ind[1]][ind[2]] = Ki[1][2];
        
        Ki_new[ind[2]][ind[0]] = Ki[2][0];
        
        Ki_new[ind[2]][ind[1]] = Ki[2][1];
        
        Ki_new[ind[2]][ind[2]] = Ki[2][2];

        return Ki_new;
    }

    getStifnessMatrix(coords, Lambda) {
        J = [
            [coords[0][2] - coords[0][0], coords[1][2] - coords[1][0]],
            [coords[0][1] - coords[0][0], coords[1][1] - coords[1][0]]
        ];

        Bnat = [
            [-1, 0, 1],
            [-1, 1, 0]
        ];

        B = MultiplyMatrix(InverseMatrix(J), Bnat);
        return MultiplyMatrix(multMatrixNumber(Lambda, TransMatrix(B)), MultiplyMatrix(Determinant(J) / 2, B));
    }

    solve() {

        let nodeLength = this.coords.length;    
        let K = new Array(nodeLength);
        let R = [];

        for (let i = 0; i < K.length; i++) {
            K[i] = new Array(nodeLength);
        }

        for (i in K) {
            i = 0;
        }

        for (let i = 0; i < this.elemNodes.length; i++) {
            var elem_n_lock = [1, 2, 3];
            elem_n_lock[0] = this.elemNodes[i][0];
            elem_n_lock[1] = this.elemNodes[i][1];
            elem_n_lock[2] = this.elemNodes[i][2];
        

            R = [1, 2, 3];
            for (let i = 0; i < 3; i++) {
                R[i] = this.nodes[elem_n_lock[i]];
            }

            Ki = getStifnessMatrix(R, elemNodes(i, 3));
            Ki = transformMatrix(nodeLength, elem_n_lock, Ki);

            K = SumMatrix(K, Ki);
        }
        
        var F = new Array(nodeLength);

        /*for (let i = 0; i < bc.length; i++) {
            K(bc(1,i),:) = zeros(1,N);
            K(bc(1,i),bc(1,i)) = 1;
            F(bc(1,i),1) = bc(2,i);
        }*/


            /*                                         


                                            for i=1:size(elem_nodes,2)
                                                R = [];
                                                elem_n_lock = elem_nodes(1:3,i);
                                                R = [nodes(:,elem_n_lock(1)),nodes(:,elem_n_lock(2)),nodes(:,elem_n_lock(3))];
                                                [Ki] = get_stiffness_matrix(R,elem_nodes(4,i));
                                                [Ki] = transform_matrix(N,elem_n_lock,Ki);
                                                K = K + Ki;
                                            end

        F = zeros(N,1);

        for i=1:size(bc,2)
            K(bc(1,i),:) = zeros(1,N);
            K(bc(1,i),bc(1,i)) = 1;
            F(bc(1,i),1) = bc(2,i);
        end

        T = linsolve(K,F);
        */
    }
}