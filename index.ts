#!/usr/bin/env node

import clear from 'clear'
import prompts from 'prompts'
import fs from 'fs-extra'
import exec from 'exec-sh'
import colors from 'colors'
import cliSpinners from 'cli-spinners'
import logUpdate from 'log-update-async-hook'
import path from 'path'

class ArgoCli {
  private argoDir: string = __dirname

  constructor () {
    this.menu()
  }

  async menu () {
    clear()
  
    const { action, } = await prompts({
      type: 'select',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        { title: 'Start a new project', value: 'init', },
      ],
    })

    this[`action_${action}`]()
  }

  /* ========================================= ACTIONS ========================================== */

  async action_init (): Promise<void> {
    const configure = async (): Promise<IConfigureData> => {
      const { name, } = await prompts({
        type: 'text',
        name: 'name',
        message: 'What is the name of the project?',
      })
  
      const modules: string[] = await this.selectModules()

      const { serverPort, } = modules.includes('server')
        ?
        await prompts({
          type: 'number',
          name: 'serverPort',
          message: 'Which port will the server use?',
          initial: 3000,
        })
        :
        null

      const ormDb = modules.includes('orm')
        ?
        await this.selectOneDb('Which databases will be used with ORM?')
        :
        null

      const { ormDbHost, } = modules.includes('orm')
        ?
        await prompts({
          type: 'text',
          name: 'ormDbHost',
          message: 'Which host will be used by the ORM database?',
          initial: 'localhost',
        })
        :
        null

      const { ormDbPort, } = modules.includes('orm')
        ?
        await prompts({
          type: 'text',
          name: 'ormDbPort',
          message: 'Which port will be used by the ORM database?',
        })
        :
        null

      const { ormDbName, } = modules.includes('orm')
        ?
        await prompts({
          type: 'text',
          name: 'ormDbName',
          message: 'What will be the name of the ORM database?',
        })
        :
        null

      const { ormDbUser, } = modules.includes('orm')
        ?
        await prompts({
          type: 'text',
          name: 'ormDbUser',
          message: 'Which user will be used by the ORM database?',
        })
        :
        null

      const { ormDbPassword, } = modules.includes('orm')
        ?
        await prompts({
          type: 'password',
          name: 'ormDbPassword',
          message: 'Which password will be used by the ORM database?',
        })
        :
        null

      const pathDir = path.resolve(name)
      const pathSrcDir = path.resolve(path.join(name, 'src'))

      return {
        name,
        modules,
        ormDb,
        ormDbHost,
        ormDbPort,
        ormDbName,
        ormDbUser,
        ormDbPassword,
        serverPort,
        pathDir,
        pathSrcDir,
      }
    }

    const createDir = (name: string): void => {
      if (!fs.existsSync(name)){
        fs.mkdirSync(name)
      }
      else {
        this.error(`A directory named "${name}" already exists`)
      }
    }

    const createSrcDir = (): void => {
      if (!fs.existsSync(pathSrcDir)) {
        fs.mkdirSync(pathSrcDir)
      }
    }

    const prepareORM = (
      pathDir: string,
      pathSrcDir: string,
      config: IConfigureData
    ): IProgressData => {
      return {
        message: 'Installing TypeORM...',
        handler: async () => {
          await exec.promise('npx typeorm init --database ' + config.ormDb, {
            cwd: pathDir,
            detached: true,
          })

          await fs.unlinkSync(path.join(pathSrcDir, 'index.ts'))

          await  fs.copySync(
            path.join(this.argoDir, 'models', 'orm'),
            path.join(pathSrcDir, 'orm')
          )

          const ormconfigJsonAddrs = path.join(pathDir, 'ormconfig.json')
          const ormconfigTsAddrs = path.join(pathDir, 'ormconfig.ts')
          const ormconfig = require(ormconfigJsonAddrs)

          ormconfig.entities[0] = ormconfig.entities[0].replace('.ts', '.js')

          if (config.ormDbHost) {
            ormconfig.host = config.ormDbHost
          }

          if (config.ormDbPort) {
            ormconfig.port = config.ormDbPort
          }

          if (config.ormDbName) {
            ormconfig.database = config.ormDbName
          }

          if (config.ormDbUser) {
            ormconfig.username = config.ormDbUser
          }

          if (config.ormDbPassword) {
            ormconfig.password = config.ormDbPassword
          }
          
          await fs.appendFileSync(path.join(pathDir, '.env'), (
            `TYPEORM_DB_TYPE=${ormconfig.type}\n` +
            `TYPEORM_DB_HOST=${ormconfig.host}\n` +
            `TYPEORM_DB_PORT=${ormconfig.port}\n` +
            `TYPEORM_DB_NAME=${ormconfig.database}\n` +
            `TYPEORM_DB_USER=${ormconfig.username}\n` +
            `TYPEORM_DB_PASSWORD=${ormconfig.password}\n\n`
          ))

          ormconfig.type = '[[TYPE]]'
          ormconfig.host = '[[HOST]]'
          ormconfig.port = '[[PORT]]'
          ormconfig.database = '[[DATABASE]]'
          ormconfig.username = '[[USERNAME]]'
          ormconfig.password = '[[PASSWORD]]'

          await fs.unlinkSync(ormconfigJsonAddrs)

          const ormconfigString = JSON.stringify(ormconfig, null, 2)
            .replace('"[[TYPE]]"', 'process.env.TYPEORM_DB_TYPE')
            .replace('"[[HOST]]"', 'process.env.TYPEORM_DB_HOST')
            .replace('"[[PORT]]"', 'process.env.TYPEORM_DB_PORT')
            .replace('"[[DATABASE]]"', 'process.env.TYPEORM_DB_NAME')
            .replace('"[[USERNAME]]"', 'process.env.TYPEORM_DB_USER')
            .replace('"[[PASSWORD]]"', 'process.env.TYPEORM_DB_PASSWORD')

          await fs.writeFileSync(
            ormconfigTsAddrs,
            'require(\'dotenv\').config()\n\n' +
            'export default ' + ormconfigString
          )
        },
      }
    }

    const prepareServer = (
      pathDir: string,
      pathSrcDir: string,
      config: IConfigureData
    ): IProgressData => {
      return {
        message: 'Installing Express...',
        handler: async () => {
          createSrcDir()

          await exec.promise('npm install --save express', {
            cwd: pathDir,
            detached: true,
          })

          await  fs.copySync(
            path.join(this.argoDir, 'models', 'server'),
            path.join(pathSrcDir, 'server')
          )

          await fs.appendFileSync(path.join(pathDir, '.env'), (
            `EXPRESS_PORT=${config.serverPort}\n`
          ))
        },
      }
    }

    const indexModules = (pathSrcDir: string, config: IConfigureData): IProgressData => {
      return {
        message: 'Indexing modules...',
        handler: async () => {
          const imports: string[] = []
          const execs: string[] = []

          config.modules.map(module => imports.push(`import ${module} from './${module}'`))
          config.modules.map(module => execs.push(`  await ${module}()`))

          const code: string[] = [
            ...imports,
            '',
            '(async () => {',
            ...execs,
            '})()',
          ]
          
          await fs.appendFileSync(path.join(pathSrcDir, 'index.ts'), code.join('\n'))
        },
      }
    }

    const finalPreparations = (pathDir: string): IProgressData => {
      return {
        message: 'Final preparations...',
        handler: async () => {
          const packageJsonAddrs = path.join(pathDir, 'package.json')

          await exec.promise('npm install --save nodemon ts-node typescript dotenv', {
            cwd: pathDir,
            detached: true,
          })

          const packagesJson = require(packageJsonAddrs)

          packagesJson.scripts = {
            'build': 'tsc',
            'build:watch': 'tsc --watch',
            'start': 'nodemon ./src',
            'start:watch': 'nodemon ./src --watch',
            'start:ts': 'ts-node src/index.ts',
            'start:ts:watch': 'ts-node src/index.ts --watch',
          }

          await fs.writeFileSync(packageJsonAddrs, JSON.stringify(packagesJson, null, 2))

          await fs.unlinkSync(path.join(pathDir, 'tsconfig.json'))

          await  fs.copySync(
            path.join(this.argoDir, 'tsconfig.json'),
            path.join(pathDir, 'tsconfig.json')
          )
        },
      }
    }

    const config = await configure()

    const pathDir = path.resolve(config.name)
    const pathSrcDir = path.resolve(path.join(config.name, 'src'))

    const progress: IProgressData[] = []

    createDir(pathDir)

    if (config.modules.includes('orm')) {
      progress.push(prepareORM(pathDir, pathSrcDir, config))
    }

    if (config.modules.includes('server')) {
      progress.push(prepareServer(pathDir, pathSrcDir, config))
    }

    progress.push(indexModules(pathSrcDir, config))
    progress.push(finalPreparations(pathDir))

    this.progress(progress, 'Project created!')
  }

  /* ===================================== SHARED METHODS ====================================== */

  selectModules (message?: string): Promise<string[]> {
    return this.selectModule(message, { multi: true, }) as Promise<string[]>
  }

  selectOneModule (message?: string): Promise<string> {
    return this.selectModule(message, { multi: false, }) as Promise<string>
  }
  
  async selectModule (message?: string, params?: ISelectParams): Promise<string | string[]> {
    const { modules, } = await prompts({
      type: params?.multi ? 'multiselect' : 'select',
      name: 'modules',
      message: message || 'Which modules will be used?',
      choices: [
        {
          title: 'Express',
          description: 'Allows you to create a server to receive and respond to requests',
          value: 'server',
        },
        {
          title: 'TypeORM',
          description: (
            'Structure the code into entities that intelligently communicate with database tables'
          ),
          value: 'orm',
        },
        { title: 'Mail', value: 'mail', disabled: true, },
        { title: 'PDF', value: 'pdf', disabled: true, },
      ],
    })

    return modules
  }

  selectDbs (message?: string): Promise<string[]> {
    return this.selectDb(message, { multi: true, }) as Promise<string[]>
  }

  selectOneDb (message?: string): Promise<string> {
    return this.selectDb(message, { multi: false, }) as Promise<string>
  }
  
  async selectDb (message?: string, params?: ISelectParams): Promise<string | string[]> {
    const { dbs, } = await prompts({
      type: params?.multi ? 'multiselect' : 'select',
      name: 'dbs',
      message: message || 'Which databases will be used?',
      choices: [
        {
          title: 'MySql',
          value: 'mysql',
        },
        {
          title: 'NariaDB',
          value: 'mariadb',
        },
        {
          title: 'Postgres',
          value: 'postgres',
        },
        {
          title: 'Cockroachdb',
          value: 'cockroachdb',
        },
        {
          title: 'SqLite',
          value: 'sqlite',
        },
        {
          title: 'MsSql',
          value: 'mssql',
        },
        {
          title: 'Oracle',
          value: 'oracle',
        },
        {
          title: 'MongoDb',
          value: 'mongodb',
        },
        {
          title: 'Cordova',
          value: 'cordova',
        },
        {
          title: 'React Native',
          value: 'react-native',
        },
        {
          title: 'Expo',
          value: 'expo',
        },
        {
          title: 'NativeScript',
          value: 'nativescript',
        },
      ],
    })

    return dbs
  }
  
  error (message: string): void {
    console.log(colors.red.bold(this.symbol('error') + message))

    process.exit()
  }

  symbol (message: string): string {
    switch (message) {
    case 'error':
    case 'cancel': return '✘ '
      break
    case 'success':
    case 'check': return '✔ '
      break
    case 'alert':
    case 'warn':
    case 'warning': return '⚠ '
      break
    default: return '✔ '
    }
  }

  async progress (messages: IProgressData[], finalMessage?: string): Promise<void> {
    const frames = cliSpinners.aesthetic.frames

    let i = 0

    let message = ''

    console.log()

    processMessages(messages).then(() => {
      clearInterval(id)

      logUpdate(`${frames[6]}  ${finalMessage || 'Done!'}`)

      logUpdate.done()
      console.log()
    })

    const id = setInterval(() => {
      const frame = frames[i = ++i % frames.length]
     
      logUpdate(`${frame} ${message}`)
    }, cliSpinners.aesthetic.interval)

    async function processMessages (messages: IProgressData[]) {
      const messageObject: IProgressData = messages.shift() as IProgressData

      message = ' ' + messageObject.message

      await messageObject.handler()

      if (messages.length > 0) {
        return processMessages(messages)
      }
    }
  }
}

new ArgoCli()

interface IProgressData {
  message: string,
  handler: () => Promise<any>
}

interface ISelectParams {
  multi: boolean,
}

interface IConfigureData {
  modules: string[],
  name: string,
  ormDb: string | null,
  ormDbHost: string | null,
  ormDbPort: number | null,
  ormDbName: string | null,
  ormDbUser: string | null,
  ormDbPassword: string | null,
  serverPort: number | null,
  pathDir: string,
  pathSrcDir: string
}