const ytdl = require('@distube/ytdl-core');
const yts = require('yt-search');

export default async function handler(req, res) {
    const { url, type } = req.query;

    // CORS සක්‍රීය කිරීම
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    if (!url) {
        return res.status(400).json({ status: false, msg: "URL එකක් ලබා දෙන්න." });
    }

    try {
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ status: false, msg: "වැරදි YouTube URL එකක්." });
        }

        // වීඩියෝ විස්තර ලබා ගැනීම
        const info = await ytdl.getInfo(url);
        
        if (type === 'mp3') {
            // Audio Only Format එක තෝරාගැනීම
            const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
            
            return res.status(200).json({
                status: true,
                title: info.videoDetails.title,
                thumbnail: info.videoDetails.thumbnails[0].url,
                downloadLink: format.url, // මේක තමයි Direct Link එක
                format: 'mp3'
            });
        } else {
            // Video Format එක තෝරාගැනීම (Default 360p or 720p)
            const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
            
            return res.status(200).json({
                status: true,
                title: info.videoDetails.title,
                thumbnail: info.videoDetails.thumbnails[0].url,
                downloadLink: format.url,
                format: 'mp4'
            });
        }

    } catch (e) {
        console.error(e);
        return res.status(500).json({ status: false, msg: e.message });
    }
}
