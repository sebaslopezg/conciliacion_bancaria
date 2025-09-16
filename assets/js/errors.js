const errCode = {
    rowStart:'No se encuentra la llave "rowStart" revise la configuración',
    rowLimit:'No se encuentra la llave "rowLimit" revise la configuración',
    date:{
        nulls:'No se encuentra la llave "Nulls" en el objeto "date", revise la configuracion.',
        column:'No se encuentra la llave "column" en el objeto "date", revise la configuración.',
        regex:'No se encontró una Expresión regular valida en el registro de configuración del sistema, revise configuración.'
    },
    description:{
        nulls:'No se encuentra la llave "Nulls" en el objeto "descripcion", revise la configuracion.',
        column:'No se encuentra la llave "column" en el objeto "description", revise la configuración',
    },
    value:{ 
        nulls:'No se encuentra la llave "Nulls" en el objeto "value", revise la configuracion.',            
        column:'No se encuentra la llave "column" en el objeto "value", revise la configuración',
        notANumber:'El número en esta celda es invalido, esto puede deberse a una incorrecta lectura de la columna, revise la configuración',
        t_acount:{
            credit:{
                column:'No se encuentra la llave "credit" en el objeto "value.t_acount.credit", revise la configuración',
                nulls:'No se encuentra la llave "nulls" en el objeto "value.t_acount.credit", revise la configuracion'
            },
            debit:{
                column:'No se encuentra la llave "debit" en el objeto "value.t_acount.debit", revise la configuración',
                nulls:'No se encuentra la llave "nulls" en el objeto "value.t_acount.debit", revise la configuracion'
            },
        }              
    }
}