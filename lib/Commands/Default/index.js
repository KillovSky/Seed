/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
/* eslint-disable no-eval */
/* eslint-disable indent */

/* Requires */
const fs = require('fs');
const Indexer = require('../../index');

/* JSON"S | Utilidades */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));
let externalCodes = JSON.parse(fs.readFileSync(`${irisPath}/lib/Databases/Configurations/external.json`));
externalCodes = externalCodes.commands.value;
let commandFound = false;

/**
 * Retorna todos os detalhes do ambiente (`envInfo`).
 *
 * @returns {Object} O objeto `envInfo`, que contém os detalhes do ambiente da execução.
 */
function ambientDetails() {
    /* Retorna a envData */
    return envInfo;
}

/**
 * Função para fazer checagem de comandos sem prefix. Verifica se um comando específico foi
 * encontrado, com opções para diferenciar entre comandos com ou sem prefixo.
 *
 * @param {string} [commandName=''] - O nome do comando a ser verificado.
 * @param {boolean} [onlyCommand=false] - Define se a verificação deve considerar apenas
 * comandos com prefixo (true) ou sem prefixo (false).
 * @param {boolean} [isCommand=false] - Defina essa opção como 'isCmd' e não mexa nela, pois ela é
 * responsável pela validação, se desejar customizar mais o prefix, edite apenas o 'onlyCommand'.
 * @returns {string|boolean} - Retorna o nome do comando encontrado (sem prefixo) se a
 * verificação for bem-sucedida, ou `false` caso contrário.
 */
function caseChecker(
    commandName = '',
    onlyCommand = false,
    isCommand = false,
) {
    /* Checa se possui o comando, não possui case insensitive */
    if (
        (commandFound.includes(commandName) && onlyCommand === false && isCommand === false)
        || (commandFound === commandName && onlyCommand === true && isCommand === true)
    ) {
        /* Retorna o 'comando' sem prefix */
        return commandFound;
    }

    /* Retorna que não achou */
    return false;
}

/**
 * Função que executa comandos com base no input recebido.
 *
 * @async
 * @function caseDefault
 * @param {boolean} [kill=false] - Funções padrões do Baileys, como sendMessage.
 * @param {Object} [env=false] - Objeto contendo informações do ambiente, como chatId, user, etc.
 * @returns {Promise<Object>} Retorna um objeto com os resultados da execução.
 */
async function caseDefault(
    kill = false,
    env = false,
) {
    /* Define um resultado padrão */
    envInfo.results.value = false;

    /* Define o sucesso */
    envInfo.results.success = false;

    /* Try-Catch para casos de erro */
    try {
        /* Verifica se recebeu parâmetros corretos */
        if (typeof kill === 'object' && typeof env === 'object') {
            /* Importa os parâmetros, basta inserir o nome do que quiser pegar */
            const {
                chatId,
                isCmd,
                reply,
            } = env.value;

            /* Define o comando na envInfo para caso seja no-prefix */
            commandFound = env.value.command;

            /* Caso não seja um 'comando' */
            if (isCmd === false) {
                /* Define a mensagem como comando */
                commandFound = env.value.body;
            }

            /* Switch para os comandos, para saber mais leia os tutoriais */
            /* Caso queira tornar o uso de comandos sem prefix insensitivo... */
            /* ...Adicione .toLowerCase() no commandFound da switch abaixo */
            /* eslint-disable-next-line padded-blocks */
            switch (commandFound) {

                /*
                    As cases são sensíveis com os caracteres recebidos...
                    Então cuidado com letras maiúsculas, números, símbolos e demais...
                    Você pode obter a ID da mensagem enviada usando 'envInfo.results.value ='...
                    ...antes de usar 'await kill' para enviar a mensagem.
                    =========================
                    Para criar comandos sem prefix, siga o mesmo estilo abaixo
                    Comandos sem prefix com ESPAÇOS funcionam agora!
                    E também diferenciam de letras maiúsculas, símbolos e números!
                    Funcionam até se inserir no meio da mensagem, cuidado!
                    Uso: caseChecker('nome do seu comando sem prefix', false, isCmd)
                    =========================
                    Para criar comandos com prefix, use da seguinte forma:
                    Uso: caseChecker('comando', true, isCmd)
                    =========================
                    Não defina nada em isCmd, apenas envie como está, apenas isCmd
                    Se você apenas digitar case 'comando', sem usar a função caseChecker
                    Digitar o nome do comando no WhatsApp pode executar o mesmo sem argumentos
                    Sendo um tipo de pseudo comando sem prefix
                    É arriscado no caso de bash, getvar e outros
                    Então se for um comando, use a função caseChecker
                    =========================
                    Se você definir que quer executar somente se for comando
                    Mas então definir o isCmd como false
                    Nada será executado, atente-se a isso
                    =========================
                    Em geral é: caseChecker("Command", "Only Command? (true/false)", isCmd)
                */
                case caseChecker('noprefix123+@', true, isCmd):
                case 'oldcommandsystem+@123':
                case 'old command system +@123':
                case 'OLD COMMAND SYSTEM +@123':
                case caseChecker('noprefix123+@', false, isCmd):
                case caseChecker('no prefix 123 +@', false, isCmd):
                case caseChecker('NO PREFIX 123 +@', false, isCmd):
                    envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Cases', 'Standard', true, true, env.value).value }, reply);
                break;

                /*
                    Default, não insira nada fora do if...
                    As mensagens que NÃO são comandos caem fora do if!
                */
                default:
                    if (isCmd === true && !externalCodes.includes(commandFound) && envInfo.parameters.missing.value) {
                        envInfo.results.value = await kill.sendMessage(chatId, { text: Indexer('sql').languages(region, 'Cases', 'Test', true, true, env.value).value }, reply);
                    }
                break;
            }
        }

        /* Define o sucesso */
        envInfo.results.success = true;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna a nova Array */
    return logging.postResults(envInfo);
}

/**
 * Função que reseta o ambiente, redefinindo valores padrão e atualizando `envInfo` com
 * novas configurações ou valores personalizados. Também lida com erros durante o processo.
 *
 * @param {Object} [changeKey={}] - Um objeto contendo chaves e valores personalizados para
 * atualizar a `envInfo`. Se vazio, nenhuma alteração é feita.
 * @returns {Object} - Retorna um objeto contendo as exportações do módulo, incluindo funções
 * e detalhes do ambiente, ou um objeto padrão em caso de erro.
 */
function resetAmbient(changeKey = {}) {
    /* Reseta a Success */
    envInfo.results.success = false;

    /* Define o valor padrão */
    let exporting = {
        reset: resetAmbient,
    };

    /* Try-Catch para casos de erro */
    try {
        /* Define a envInfo padrão */
        envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

        /* Define se algum valor deve ser salvo */
        if (Object.keys(changeKey).length !== 0) {
            /* Faz a listagem de keys */
            Object.keys(changeKey).forEach((key) => {
                /* Edita se a key existir */
                if (Object.keys(envInfo).includes(key) && key !== 'developer') {
                    /* Edita a key customizada */
                    envInfo[key] = changeKey[key];
                }
            });
        }

        /* Insere a postResults na envInfo */
        envInfo.functions.poswork.value = logging.postResults;

        /* Insere a ambient na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a error na envInfo */
        envInfo.functions.messedup.value = logging.echoError;

        /* Insere a revert na envInfo */
        envInfo.functions.revert.value = resetAmbient;

        /* Insere a caseDefault na envInfo */
        envInfo.functions.exec.value = caseDefault;

        /* Insere a caseChecker na envInfo */
        envInfo.functions.checker.value = caseChecker;

        /* Define o local completo na envInfo */
        envInfo.parameters.location.value = __filename;

        /* Gera a module exports */
        module.exports = {
            [envInfo.name]: {
                [envInfo.exports.env]: envInfo.functions.ambient.value,
                [envInfo.exports.messedup]: envInfo.functions.messedup.value,
                [envInfo.exports.poswork]: envInfo.functions.poswork.value,
                [envInfo.exports.reset]: envInfo.functions.revert.value,
                [envInfo.exports.exec]: envInfo.functions.exec.value,
                [envInfo.exports.checker]: envInfo.functions.checker.value,
            },
            Developer: 'KillovSky',
            Projects: 'https://github.com/KillovSky',
        };

        /* Determina sucesso */
        envInfo.results.success = true;

        /* Define o valor retornado */
        exporting = module.exports;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        logging.echoError(error, envInfo, __dirname);
    }

    /* Retorna o exports */
    return exporting;
}

/* Constrói a envInfo */
resetAmbient();
