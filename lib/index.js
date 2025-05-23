/* eslint-disable max-len */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

/* Requires */
const fs = require('fs');
const path = require('path');

/* JSON's | Utilidades */
const commandPlaces = JSON.parse(fs.readFileSync('./lib/Databases/Configurations/symlinks.json'));

/* Se for usar a Indexer sem WhatsApp */
global.config = global.config || JSON.parse(fs.readFileSync('./lib/Databases/Configurations/config.json'));
global.irisPath = global.irisPath || process.cwd();
global.region = global.region || 'pt';
global.logging = global.logging || require('./Initialize/logging');

/**
 * Obtém um comando pelo seu alias no arquivo 'symlinks.json' ou nomes de pastas localizadas em '/lib/Functions'.
 * @param {string} systemName - O nome da pasta do código ou alias do comando a ser obtido [symlinks.json | /lib/Functions/*].
 * @returns {Object} Uma object com as funções correspondentes ao sistema ou funções padrão, se houver um erro.
 */
function controlSystem(
    systemName = 'Default',
) {
    /* Define o sistema */
    let funControl = systemName || 'Default';

    /* Try pra caso o arquivo de função não exista */
    try {
        /* Caso não seja uma String */
        if (typeof funControl !== 'string') {
            /* Define a default */
            funControl = 'Default';
        }

        /* Define o nome da função como minusculo */
        const toyBox = funControl.toLowerCase();

        /* Verifica os locais um a um */
        let commandFolder = (Object.keys(commandPlaces)
            /* Filtra somente o resultado válido */
            .filter((objname) => commandPlaces[objname].alias.includes(toyBox))
        );

        /* Verifica se o resultado foi nulo */
        if (commandFolder.length === 0) {
            /* Adquire as pastas dentro das funções */
            let tempFolders = (fs.readdirSync('./lib/Functions'));

            /* Converte os nomes de pastas em lowercase */
            tempFolders = tempFolders.map((s) => s.toLowerCase());

            /* Verifica se a pasta existe dentro das funções */
            if (tempFolders.includes(toyBox)) {
                /* Caso exista, define o comando como o recebido */
                commandFolder = [toyBox];

                /* E insere ele no arquivo de symlinks */
                commandPlaces[toyBox] = {
                    alias: commandFolder,
                    place: `./Functions/${commandFolder[0]}`,
                };

                /* Salva em disco */
                fs.writeFileSync('./lib/Databases/Configurations/symlinks.json', JSON.stringify(commandPlaces, null, 4));

                /* Caso o comando não exista */
            } else {
                /* Define o padrão */
                commandFolder = ['Default'];
            }
        }

        /* Ajusta para o primeiro valor da Array achada */
        [commandFolder] = [commandFolder[0]];

        /* Ajusta o local */
        commandFolder = path.resolve(__dirname, commandPlaces[commandFolder].place);
        commandFolder = path.normalize(commandFolder);

        /* Faz a exports e retorna ela */
        const Sys = require(commandFolder);
        return Sys[Object.keys(Sys)[0]];

        /* Caso der erro cairá nesse sistema abaixo */
    } catch (error) {
        /* Printa o erro sem nenhuma opção para ocultar */
        console.error(error);

        /* Retorna false para a execução parar */
        return false;
    }
}

/* Exporta a função */
module.exports = controlSystem;
