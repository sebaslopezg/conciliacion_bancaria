const defaultConf = {
    bankConf:{
        rowStart: 2,
        rowLimit:false,
        date:{
            column:'A',
            readByRegex: 0,
            setYear:true,
            nulls: false
        },
        description:{
            column:'B',
            nulls: false
        },
        value:{
            column:'D',
            nulls: false
        },
        saveValues:[],
        replaceValues:[]
    },
    systemConf:{
        rowStart: 2,
        rowLimit:false,
        date:{
            column:'A',
            nulls: false
        },
        description:{
            column:'B',
            nulls: false
        },
        value:{
            t_acount:{
                credit:{
                    column: "C",
                    nulls: true
                },
                debit:{
                    column: "D",
                    nulls: true
                }
            }
        },
        saveValues:[],
        replaceValues:[]
    }
}

const defaultRegex = [
    {
        regex: /^\d{1,2}\/\d{1,2}$/,
        description:'Permitir solo fecha de dos valores sin año EJ: 01/01'
    }
]