const board = "#connect4-body";
const rows  = 6;
const cols  = 7;
let   user  = 1;

$( document ).ready(function() {
    createGrid();
    eventListener();
});

const createGrid = () => {

    let rows_cols;

    for(i = 1; i <= rows; i++){

        row_cols = $(`<div id="row-${i}" class="rows">`);
        
        for(x = 1; x <= cols; x++){
            row_cols.append(`<div id="row-${i}_col-${x}" class="cols empty">`);
        }

        $(board).append(row_cols);
    }

}

const eventListener = () => {
    $( ".cols" ).on( "click", function() {
        
       let id_selector =  $(this).attr('id');
       let split_val   =  $(this).attr('id').split('_');

       let obj_params  = {
        id: id_selector,
        row_loc: split_val[0],
        col_loc: split_val[1]
       };

       runProcess(obj_params);
        
    });
}

const runProcess = (params) => {
        
        //check empty slots and get the slot to be filled
        sel_empty_item = checkEmptySlots(params);
      
        //insert item to slot
        nxt_user = insertToSlot(params, sel_empty_item);

        //check if has winner
        checkForWinner(params, sel_empty_item);

        user = nxt_user;
}

const checkEmptySlots = (params) => {

    let item, sel_empty_item;

    for(i=1; i<=rows; i++){
        item = `row-${i}_${params.col_loc}`;
        
        if($("#" + `${item}`).hasClass('empty')){
            sel_empty_item = item; //return selected item row
        }
    }

    return sel_empty_item;
}

const insertToSlot = (params, slot_num) => {

    switch(user){
        case 1:
            $(`#${sel_empty_item}`).css('background', 'red').removeClass(`empty`).attr(`value`, `${user}`);
            nxt_user = 2; //select next user
        break;
        case 2:
            $(`#${sel_empty_item}`).css('background', 'yellow').removeClass(`empty`).attr(`value`, `${user}`);
            nxt_user = 1; //select next user
        break;
    }

    return nxt_user;
}

const checkForWinner = (params, sel_empty_item) => {

     let flag_horizontal = false;
     let flag_diagonal   = false;
     let flag_vertical   = false;
     
    //horizontal
     flag_horizontal     = checkHorizontal(params, sel_empty_item);
     flag_vertical       = checkVertical(params,sel_empty_item);
     flag_diagonal       = checkDiagonal(params,sel_empty_item);

     if(flag_horizontal || flag_vertical || flag_diagonal){
        alert('winner');
     }
}

const checkHorizontal = (params, sel_empty_item) => {

     let flag_horizontal = false;
     let split_val       = sel_empty_item.split('_');
     let split_row       = split_val[0].split('-');
     let split_col       = split_val[1].split('-');
     let row_num         = parseInt(split_row[1]);
     let col_num         = parseInt(split_col[1]);
     let hl_points       = 0; 
     let hr_points       = 0; 
     let final_points    = 0;

     //check (horizontal)
     if( ((col_num-1) >= 1) || ((col_num+1) <= 7)){ //check if boundary has been reached
        
        //check left horizontal
        let hlpointer = (col_num - 1); //get starting point
        
        for(i=hlpointer; i>=1; i--){
           
            //check if nxt item if not empty and user is equal to value
            if( (!$(`#row-${row_num}_col-${i}`).hasClass(`empty`)) && (parseInt($(`#row-${row_num}_col-${i}`).attr(`value`)) === user ) ){
                hl_points++; //add points 
              
                if((hl_points+1) === 4){ //+1 because of the default item
                    flag_horizontal = true;
                    break;
                }
            }else{
                break;
            }
            
        }

         //check right horizontal
         let hrpointer = (col_num + 1); //get starting point
        
         for(i=hrpointer; i<=7; i++){
            
             //check if nxt item if not empty and user is equal to value
             if( (!$(`#row-${row_num}_col-${i}`).hasClass(`empty`)) && (parseInt($(`#row-${row_num}_col-${i}`).attr(`value`)) === user ) ){
                 hr_points++; //add points 
               
                 if((hr_points+1) === 4){ //+1 because of the default item
                     flag_horizontal = true;
                     break;
                 }
             }else{
                 break;
             }
             
         }
         

         //check overall points 
         if(hl_points && hr_points){
            final_points = hl_points + hr_points + 1; 

            if(final_points === 4){
                flag_horizontal = true;
            }
        }

        return flag_horizontal;

    }
     

}

const checkVertical = (params, sel_empty_item) => {

    let flag_vertical   = false;
    let split_val       = sel_empty_item.split('_');
    let split_row       = split_val[0].split('-');
    let split_col       = split_val[1].split('-');
    let row_num         = parseInt(split_row[1]);
    let col_num         = parseInt(split_col[1]);
    let v_points        = 0; 
    let final_points    = 0;

    //check (vertical)
    if( (row_num+1) <= 7){ //check if boundary has been reached
       
       let vpointer = (row_num + 1); //get starting point
       
       for(i=vpointer; i<=7; i++){
          
           //check if nxt item if not empty and user is equal to value
           if( (!$(`#row-${i}_col-${col_num}`).hasClass(`empty`)) && (parseInt($(`#row-${i}_col-${col_num}`).attr(`value`)) === user ) ){
               v_points++; //add points 
             
               if((v_points+1) === 4){ //+1 because of the default item
                   flag_vertical = true;
                   break;
               }
           }else{
               break;
           }
           
       }
       return flag_vertical;

   }
    

}

const checkDiagonal = (params, sel_empty_item) => {

    let flag_diagonal   = false;
    let split_val       = sel_empty_item.split('_');
    let split_row       = split_val[0].split('-');
    let split_col       = split_val[1].split('-');
    let row_num         = parseInt(split_row[1]);
    let col_num         = parseInt(split_col[1]);
    let dld_points      = 0; 
    let dur_points      = 0; 
    let ddr_points      = 0; 
    let dlu_points      = 0; 
    let final_points    = 0;
    let incpointer      = 1;

    //check (diagonal-down-left and diagonal-up-right ===> (/) )
    let dld_col_pointer = (col_num - incpointer); //get col starting point
    let dld_row_pointer = (row_num + incpointer); //get row starting point
    
    if( (dld_col_pointer >= 1)  && (dld_row_pointer <= 7)) { //check if boundry has been reached

        //diagonal-down-left
        for(i=dld_col_pointer; i>=1; i--){
            dld_col_pointer = (col_num - incpointer); //get col starting point
            dld_row_pointer = (row_num + incpointer); //get row starting point
           
            //check if nxt item if not empty and user is equal to value
            if( (!$(`#row-${dld_row_pointer}_col-${dld_col_pointer}`).hasClass(`empty`)) && (parseInt($(`#row-${dld_row_pointer}_col-${dld_col_pointer}`).attr(`value`)) === user ) ){
               
                dld_points++; //add points 

                if((dld_points+1) === 4){ //+1 because of the default item
                    flag_diagonal = true;
                    break;
                }
            }else{
                break;
            }
            incpointer++;   
        }
            
        //diagonal-up-right
        incpointer = 1; //reset
        let dru_col_pointer = (col_num + incpointer); //get col starting point
        let dru_row_pointer = (row_num - incpointer); //get row starting point

        for(i=dru_row_pointer; i<=7; i++){
            dru_col_pointer = (col_num + incpointer); //get col starting point
            dru_row_pointer = (row_num - incpointer); //get row starting point
           
            //check if nxt item if not empty and user is equal to value
            if( (parseInt($(`#row-${dru_row_pointer}_col-${dru_col_pointer}`).attr(`value`)) === user ) ){
               
                dur_points++; //add points 
                if((dur_points+1) === 4){ //+1 because of the default item
                    flag_diagonal = true;
                    break;
                }
            }else{
                break;
            }
            incpointer++;   
        }

        //check overall points 
        
        if(dld_points && dur_points){
           final_points = dld_points + dur_points + 1; 

           if(final_points === 4){
              flag_diagonal = true;
           }
       }
    }

    //check (diagonal-left-up and diagonal-down-right ==> (\) )
    incpointer = 1; //reset
    let dlu_col_pointer = (col_num - incpointer); //get col starting point
    let dlu_row_pointer = (row_num - incpointer); //get row starting point
    
    if( ( (dlu_row_pointer <= 7) && (dlu_col_pointer <= 7)) ) { //check if boundry has been reached
      
        //diagonal-up-left
        for(i=dlu_col_pointer; i>=1; i--){
            dlu_col_pointer = (col_num - incpointer); //get col starting point
            dlu_row_pointer = (row_num - incpointer); //get row starting point
           
            //check if nxt item if not empty and user is equal to value
            if( (!$(`#row-${dlu_row_pointer}_col-${dlu_col_pointer}`).hasClass(`empty`)) && (parseInt($(`#row-${dlu_row_pointer}_col-${dlu_col_pointer}`).attr(`value`)) === user ) ){
               
                dlu_points++; //add points 
                if((dlu_points+1) === 4){ //+1 because of the default item
                    flag_diagonal = true;
                    break;
                }
            }else{
                break;
            }
            incpointer++;   
        }
            
        //diagonal-down-right
        incpointer = 1; //reset
        let ddr_col_pointer = (col_num + incpointer); //get col starting point
        let ddr_row_pointer = (row_num + incpointer); //get row starting point
        for(i=ddr_row_pointer; i<=7; i++){
            ddr_col_pointer = (col_num + incpointer); //get col starting point
            ddr_row_pointer = (row_num + incpointer); //get row starting point
           
            //check if nxt item if not empty and user is equal to value
            if( (!$(`#row-${ddr_row_pointer}_col-${ddr_col_pointer}`).hasClass(`empty`)) && (parseInt($(`#row-${ddr_row_pointer}_col-${ddr_col_pointer}`).attr(`value`)) === user ) ){
               
                ddr_points++; //add points 
                if((ddr_points+1) === 4){ //+1 because of the default item
                    flag_diagonal = true;
                    break;
                }
            }else{
                break;
            }
            incpointer++;   
        }

        //check overall points 
        
        if(dlu_points && ddr_points){
           final_points = dlu_points + ddr_points + 1; 

           if(final_points === 4){
              flag_diagonal = true;
           }
       }
    }

    return flag_diagonal;

}