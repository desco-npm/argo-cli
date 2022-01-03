#!/usr/bin/env node

import clear from 'clear'
import prompts from 'prompts'
import fs from 'fs'
import exec from 'exec-sh'
import colors from 'colors'
import cliSpinners from 'cli-spinners'
import logUpdate from 'log-update-async-hook'


class ArgoCli {
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
    const { name, } = await prompts({
      type: 'text',
      name: 'name',
      message: 'What is the name of the project? (Leave blank to start in current directory)',
    })

    const modules: string[] = await this.selectModules()
    const progress: IProgressData[] = []

    if (modules.includes('orm')) {
      if (!fs.existsSync(name)){
        fs.mkdirSync(name)
      }
      else {
        this.error(`A directory named "${name}" already exists`)
      }

      progress.push({
        message: 'Starting TypeORM...',
        handler: () => {
          return exec.promise('npx typeorm init --database mysql', { cwd: name, detached: true, })
        },
      })
    }

    this.progress(progress, 'Project created!')
  }

  /* ===================================== SHARED METHODS ====================================== */

  selectModules (): Promise<string[]> {
    return this.selectModule()
  }
  
  async selectModule (message?: string): Promise<string[]> {
    const { modules, } = await prompts({
      type: 'multiselect',
      name: 'modules',
      message: message || 'Which modules will be used?',
      choices: [
        { title: 'Server', value: 'server', disabled: true, },
        { title: 'ORM', value: 'orm', },
        { title: 'Mail', value: 'mail', disabled: true, },
        { title: 'PDF', value: 'pdf', disabled: true, },
      ],
    })

    return modules
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