const defaultConf = {
    bankConf:{
        rowStart: 2,
        rowLimit:false,
        date:{
            column:'A',
            readByRegex: 0,
            setYear:true
        },
        description:{
            column:'B'
        },
        value:{
            column:'D'
        }
    },
    systemConf:{
        rowStart: 2,
        rowLimit:false,
        date:{
            column:'A'
        },
        description:{
            column:'B'
        },
        value:{
            t_acount:{
                credit:'C',
                debit:'D'
            }
        }
    }
}

const defaultRegex = [
    {
        regex: /^\d{1,2}\/\d{1,2}$/,
        description:'Permitir solo fecha de dos valores sin año EJ: 01/01'
    }
]