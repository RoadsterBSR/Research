
namespace Research.Core.Components
{
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;
        
    public class FileSystem
    {
        public async Task<bool> CheckIfFileExistsAsync(string path)
        {
            return await Task.Factory.StartNew(() => { return File.Exists(path); });
        }

        public async Task CreateDirectoryAsync(string path)
        {
            await Task.Factory.StartNew(() => {
                Directory.CreateDirectory(path);
            });
        }

        public async Task DeleteDirectoryAsync(string path)
        {
            string[] files = await GetFilesAsync(path, "*", SearchOption.AllDirectories);
            await DeleteFilesAsync(files);
            await Task.Factory.StartNew(() =>
            {
                Directory.Delete(path, true);
            });
        }

        public async Task<string[]> GetFilesAsync(string path, string searchPattern, SearchOption searchOption)
        {
            return await Task.Factory.StartNew(() =>
            {
                return Directory.GetFiles(path, searchPattern, searchOption);
            });
        }

        public async Task<string[]> GetDirectoriesAsync(string path, string searchPattern, SearchOption searchOption)
        {
            return await Task.Factory.StartNew(() =>
            {
                return Directory.GetDirectories(path, searchPattern, searchOption);
            });
        }

        public async Task DeleteFileAsync(string path)
        {
            await MakeFileWritableAsync(path);
            await Task.Factory.StartNew(() =>
            {
                File.Delete(path);
            });
        }

        public async Task DeleteFilesAsync(string[] files)
        {
            foreach (string file in files)
            {
                await DeleteFileAsync(file);
            }
        }

        public async Task GenerateFileAsync(FileInfoDto file)
        {
            string folder = await Task.Factory.StartNew(() =>
            {
                return Path.GetDirectoryName(file.Path);
            });
            await CreateDirectoryAsync(folder);
            await MakeFileWritableAsync(file.Path);
            await WriteAllTextAsync(file.Path, file.Content);
        }

        public async Task GenerateFilesAsync(List<FileInfoDto> files)
        {
            foreach (FileInfoDto file in files)
            {
                await GenerateFileAsync(file);
            }
        }

        public async Task MakeFileWritableAsync(string path)
        {
            bool fileExists = await CheckIfFileExistsAsync(path);
            if (fileExists)
            {
                await Task.Factory.StartNew(() =>
                {
                    File.SetAttributes(path, FileAttributes.Normal);
                });
            }
        }

        public async Task MakeFilesWritableAsync(string[] files)
        {
            foreach (string file in files)
            {
                await MakeFileWritableAsync(file);
            }
        }

        public async Task<string> ReadAllTextAsync(string path)
        {
            string result = await Task.Factory.StartNew(() => { return File.ReadAllText(path); });
            return result;
        }

        public async Task WriteAllTextAsync(string path, string content)
        {
            await Task.Factory.StartNew(() => { File.WriteAllText(path, content); });
        }
    }

    public class FileInfoDto
    {
        public string Path { get; set; }
        public string Content { get; set; }
    }
}