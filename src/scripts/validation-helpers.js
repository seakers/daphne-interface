export async function validate_row(row_object){
    console.log("VALIDATION", row_object);
    let items = row_object.items;
    let col_types = row_object.col_types;


    for(let x=0;x<items.length;x++){
        let item = items[x]
        let col_type = col_types[x]

        // VALIDATION 
        if(col_type === 'pk'){
            continue;
        }
        if(col_type === 'string'){
            continue;
        }
        else if(col_type === 'list'){
            for(let y=0;y<item.length;y++){
                // TODO: list type validation
            }
        }
        else if(col_type === 'double'){
            if(item !== 'NaN'){
                if( isNaN(item) || item === ''){
                    return `${item} is an invalid double. Input either a true double or NaN`;
                }
            }  
        }
        else if(col_type === 'int'){
            if(item !== 'NaN'){
                if( isNaN(item) || item.toString().indexOf('.') != -1 || item === ''){
                    return `${item} is an invalid int. Input either a true int or NaN`;
                }
            }
        }
    }
    return true;
}
