import {readdirSync} from 'node:fs'
import {join, relative} from 'node:path'
import type Elysia from 'elysia'

export const registerStaticFilesRoutes = async (app: Elysia) => {
  const distFolder = join(__dirname, '../../gateway/dist')

  readdirSync(distFolder, {recursive: true, withFileTypes: true})
    .filter((file) => file.isFile())
    .forEach((file) => {
      const fileNameRelativeToDist = join(
        relative(join(__dirname, '../../gateway/dist'), file.parentPath),
        file.name,
      )
      return app.get(
        fileNameRelativeToDist,
        Bun.file(join(__dirname, '../../gateway/dist', fileNameRelativeToDist)),
      )
    })
  return app
}
