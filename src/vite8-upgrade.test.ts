import { describe, it, expect } from 'vitest'
import packageJson from '../package.json'

describe('Vite 8 Upgrade', () => {
  it('should declare vite dependency as ^8.x.x', () => {
    const deps = packageJson.dependencies as Record<string, string> | undefined
    const devDeps = packageJson.devDependencies as Record<string, string> | undefined
    const viteVersion = deps?.vite ?? devDeps?.vite
    expect(viteVersion).toMatch(/^\^8\./)
  })

  it('should declare @vitejs/plugin-react compatible with Vite 8', () => {
    const deps = packageJson.dependencies as Record<string, string> | undefined
    const devDeps = packageJson.devDependencies as Record<string, string> | undefined
    const pluginVersion = deps?.['@vitejs/plugin-react'] ?? devDeps?.['@vitejs/plugin-react']
    expect(pluginVersion).toMatch(/^\^(5|6)\./)
  })
})
