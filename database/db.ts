import {Pool} from 'pg';
// // pool de conexões - mecanismo automatizado que reserva 20/30 conexões prontas com o banco e vai distribuindo para as requisições - Tipo server 1
// const pool = new Pool({
//     user: 'postgres',
//     database: 'pix_system',
//     password: 'masterkey',
//     port: 5432,
//     max: 5,
//     idleTimeoutMillis: 30000,

// })

// export default pool

const pool = new Pool({
    user: 'postgres',
    database: 'Pix',
    password: "123589",
    port: 5432,
    max: 20,
    idleTimeoutMillis: 3000
});

export default pool;
//usar o default permite quando eu importar mudar o nome da exportação
