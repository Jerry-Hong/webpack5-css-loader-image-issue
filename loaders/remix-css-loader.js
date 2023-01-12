"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pitch = void 0;
const loader_utils_1 = require("loader-utils");
const getPublicPath = (loaderContext) => {
    let { publicPath } = loaderContext._compilation.outputOptions;
    if (typeof publicPath !== 'string') {
        throw Error('Public path must be a string');
    }
    return publicPath;
};
const getCssChunkFilename = (loaderContext) => {
    let { cssChunkFilename, assetModuleFilename } = loaderContext._compilation.outputOptions;
    return typeof cssChunkFilename === 'string'
        ? cssChunkFilename
        : typeof assetModuleFilename === 'string'
            ? assetModuleFilename
            : '_assets/[name]-[contenthash][ext]';
};
async function pitch(source) {
    let callback = this.async();
    let options = this.getOptions();
    let originalExports = (await this.importModule(this.resourcePath + '.webpack[javascript/auto]' + '!=!' + source));
    let exports = originalExports.__esModule ? originalExports.default : originalExports;
    let css = exports[0].slice(1).join('\n');
    //@ts-ignore
    let assetPath = (0, loader_utils_1.interpolateName)(this, getCssChunkFilename(this), {
        content: css,
    });
    let result = `
export const link = {
  rel: "stylesheet",
  href: ${JSON.stringify(getPublicPath(this) + assetPath)},
}
`;
    let classNamesMap = exports.locals;
    if (classNamesMap !== undefined) {
        result += `\nexport const styles = ${JSON.stringify(classNamesMap)}`;
    }
    // TODO: sourcemaps?
    if (options.emit) {
        this.emitFile(assetPath, css);
    }
    return callback(undefined, result);
}
exports.pitch = pitch;
//# sourceMappingURL=remix-css-loader.js.map