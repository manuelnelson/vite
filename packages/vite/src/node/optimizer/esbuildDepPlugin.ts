import path from 'path'
import { Plugin } from 'esbuild'
import { knownAssetTypes } from '../constants'
// import isBuiltin from 'isbuiltin'

const externalTypes = ['css', 'vue', 'svelte', ...knownAssetTypes]

export function esbuildDepPlugin(
  dedupe: string[] | undefined,
  qualified: Record<string, string>
): Plugin {
  return {
    name: 'vite:dep-optimize',
    setup(build) {
      build.onResolve(
        {
          filter: new RegExp(`\\.(` + externalTypes.join('|') + `)(\\?.*)?$`)
        },
        ({ path: _path, importer }) => {
          if (_path.startsWith('.')) {
            const dir = path.dirname(importer)
            return {
              path: path.resolve(dir, _path),
              external: true
            }
          }
        }
      )

      if (dedupe) {
        build.onResolve(
          {
            filter: new RegExp(`^(${dedupe.join('|')})$`)
          },
          ({ path: id }) => {
            if (id in qualified) {
              return {
                path: qualified[id]
              }
            }
          }
        )
      }
    }
  }
}
