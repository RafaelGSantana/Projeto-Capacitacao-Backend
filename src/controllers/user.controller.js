const { Usuario } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const cadastro = async (request,response) => {

    try {

        const { nome , email, senha, nascimento, sexo, idioma } = request.body

        if(!(nome && email && senha)){
            response.status(400).send("Preencha todos os campos obrigatórios!")
        }

        const checkExiste = await Usuario.findOne({ where: {
            email: email
            } 
        })

        if (checkExiste) {
            return response.status(409).send("Este e-mail já está sendo utilizado, faça o login.")
        }

        cryptSenha = await bcrypt.hash(senha, 10)

        const novoUsuario = await Usuario.create({
            nome,
            email: email.toLowerCase(),
            senha: cryptSenha,
            nascimento,
            sexo,
            idioma,
        })

        const token = jwt.sign(
            { usuario_id: novoUsuario._id, email },
            TOKEN_KEY = 'projeto_rota_66',
            {
                expiresIn: "1h",
            }
        )
        novoUsuario.token = token

        const id_usuario = novoUsuario.id_usuario
        const nome_usuario = novoUsuario.nome
        const idioma_usuario = novoUsuario.idioma

        response.status(201).json({id_usuario, nome_usuario, idioma_usuario, token })
    
    } catch(err) {
        console.log(err)
    }
}

const login = async (request,response) => {

    try {

        const { email, senha } = request.body

        if(!(email && senha)){
            response.status(400).send("Preencha todos os campos obrigatórios!")
        }

        const usuario = await Usuario.findOne({ where: {
            email: email
        }
     })

        if (usuario && (await bcrypt.compare(senha, usuario.senha))) {

            const token = jwt.sign(
                { usuario_id: usuario._id, email },
                TOKEN_KEY = 'projeto_rota_66',
                {
                    expiresIn: "1h",
                }
            )

            usuario.token = token

            const id_usuario = usuario.id_usuario
            const nome_usuario = usuario.nome
            const idioma_usuario = usuario.idioma

            response.status(200).json({ id_usuario, nome_usuario, idioma_usuario, token })
        }
        response.status(400).send("E-mail e/ou senha inválidos")
    } catch (err) {
        console.log(err)
    }

}

module.exports = { cadastro, login }