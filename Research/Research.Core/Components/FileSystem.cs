
namespace Research.Core.Components
{
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;
        
    public class FileSystem
    {
        public Task<bool> CheckIfFileExistsAsync(string path)
        {
            return Task.Factory.StartNew(() => { return File.Exists(path); });
        }

        public Task CreateDirectoryAsync(string path)
        {
            return Task.Factory.StartNew(() => {
                Directory.CreateDirectory(path);
            });
        }

        public async Task DeleteDirectoryAsync(string path)
        {
            string[] files = await GetFilesAsync(path, "*", SearchOption.AllDirectories);
            await DeleteFilesAsync(files);
            Directory.Delete(path, true);
        }

        public Task<string[]> GetFilesAsync(string path, string searchPattern, SearchOption searchOption)
        {
            return Task.Factory.StartNew(() =>
            {
                return Directory.GetFiles(path, searchPattern, searchOption);
            });
        }

        public Task<string[]> GetDirectoriesAsync(string path, string searchPattern, SearchOption searchOption)
        {
            return Task.Factory.StartNew(() =>
            {
                return Directory.GetDirectories(path, searchPattern, searchOption);
            });
        }

        public async Task DeleteFileAsync(string path)
        {
            await MakeFileWritableAsync(path);
            File.Delete(path);
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
            string folder = Path.GetDirectoryName(file.Path);
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
                File.SetAttributes(path, FileAttributes.Normal);
            }
        }

        public async Task MakeFilesWritableAsync(string[] files)
        {
            foreach (string file in files)
            {
                await MakeFileWritableAsync(file);
            }
        }   

        public Task WriteAllTextAsync(string path, string content)
        {
            return Task.Factory.StartNew(() => { File.WriteAllText(path, content); });
        }
    }

    public class FileInfoDto
    {
        public string Path { get; set; }
        public string Content { get; set; }
    }
}