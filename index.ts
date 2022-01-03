#!/usr/bin/env node

import clear from 'clear'
import prompts from 'prompts'
import fs from 'fs'
import exec from 'exec-sh'
import colors from 'colors'
import cliSpinners from 'cli-spinners'
import logUpdate from 'log-update-async-hook'
import path from 'path'
import { create, } from 'domain'

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
    const configure = async (): Promise<{ name: string, db: string, modules: string[], }> => {
      const { name, } = await prompts({
        type: 'text',
        name: 'name',
        message: 'What is the name of the project? (Leave blank to start in current directory)',
      })
  
      const modules: string[] = await this.selectModules()
      let db = ''
  
      if (modules.includes('orm')) {
        db = await this.selectOneDb('Which databases will be used with ORM?')
      }

      return { name, modules, db, }
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

    const prepareORM = (pathDir: string, pathSrcDir: string, db: string): IProgressData => {
      return {
        message: 'Installing TypeORM...',
        handler: async () => {
          await exec.promise('npx typeorm init --database ' + db, {
            cwd: pathDir,
            detached: true,
          })

          await fs.unlinkSync(path.join(pathSrcDir, 'index.ts'))

          await  fs.copyFileSync(
            path.join(this.argoDir, 'models', 'orm.ts'),
            path.join(pathSrcDir, 'orm.ts')
          )
        },
      }
    }

    const prepareServer = (pathDir: string, pathSrcDir: string): IProgressData => {
      return {
        message: 'Installing Express...',
        handler: async () => {
          createSrcDir()

          await exec.promise('npm install --save express', {
            cwd: pathDir,
            detached: true,
          })

          await  fs.copyFileSync(
            path.join(this.argoDir, 'models', 'server.ts'),
            path.join(pathSrcDir, 'server.ts')
          )
        },
      }
    }

    const { name, modules, db, } = await configure()

    const pathDir = name
    const pathSrcDir = path.resolve(path.join(name, 'src'))

    const progress: IProgressData[] = []

    createDir(pathDir)

    if (modules.includes('orm')) {
      progress.push(prepareORM(pathDir, pathSrcDir, db))
    }

    if (modules.includes('server')) {
      progress.push(prepareServer(pathDir, pathSrcDir))
    }

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