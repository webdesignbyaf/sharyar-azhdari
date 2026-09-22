from pathlib import Path
import shutil, zipfile
root=Path(__file__).resolve().parent.parent
out=root/'exports'/'github-upload'
if out.exists(): shutil.rmtree(out)
out.mkdir(parents=True)
for name in ['index.html','styles.css','app.js','assets','scripts','package.json','package-lock.json','.github','.gitignore','.nojekyll','README.md','PROJEKT.md']:
    src=root/name
    if src.is_dir(): shutil.copytree(src,out/name)
    else: shutil.copy2(src,out/name)
archive=root/'exports'/'s-art-github.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for file in sorted(out.rglob('*')):
        if file.is_file(): z.write(file,file.relative_to(out))
print(f'GitHub-Ordner: {out}\nZIP: {archive} ({archive.stat().st_size/1024/1024:.1f} MB)')
