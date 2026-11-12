# Ba'Mi⁵⁴ CS2 Takım Merkezi V1.0

Bu proje **eski HasSickTear kişisel sitesi değildir**. Discord Bot, BrowserX ve Bozkurt Tracker içerikleri çıkarılmıştır. Steam grubundaki kamuya açık 11 profilin bağlantıları, Türkçe/İngilizce kadro listesi ve Leetify üzerinden son beş maç API bağlantısı vardır.

## En kolay yayın: VS Code olmadan GitHub + Vercel

1. ZIP'i çıkartın.
2. github.com/new üzerinden yeni bir **public veya private** depo oluşturun (örneğin `bami54-cs2`).
3. Depoda **Add file → Upload files** seçeneğiyle klasörün **içindeki** `api`, `public`, `tests`, `package.json`, `vercel.json` ve diğer dosyaları yükleyin (ana klasörü fazladan iç içe koymayın).
4. vercel.com/new sayfasından GitHub hesabını bağlayın ve depoyu içe aktarın.
5. Framework Preset **Other**, Root Directory `.`, Build Command **boş**, Output Directory **`public`** seçin. Deploy edin.
6. `https://<proje-adi>.vercel.app` üzerinden kontrol edin.

**Önemli:** Vercel'e yalnızca statik ZIP yüklemek serverless `/api/player` uç noktasını çalıştırmaz. Maç istatistikleri için bu GitHub üzerinden tam proje dağıtımı gereklidir.

## Maç verileri

Steam Web API bir oyuncunun son CS2 maçlarını herkese açık sunmaz. `/api/player?i=0` gibi uç noktalar SteamID64'ü Steam'in kamuya açık profil XML'inden (veya sayısal profilden) elde edip Leetify Public API'de `/v3/profile/matches?steam64_id=...` isteği yapar. Yalnızca kaydedilmiş, erişilebilir maçlar dönebilir. Bazı oyuncular için hiç veri yoktur; site bunu açıkça gösterir. K/D, skor ve galibiyet verisi sadece kaynak yanıtı doğruladığında görünür. Bazı maçların alanları ve oyuncu eşleştirmesi eksikse rakamlar boş kalabilir.

**Leetify API anahtarı:** Opsiyonel. Daha yüksek limit gerekiyorsa Vercel → Project → Settings → Environment Variables altında `LEETIFY_API_KEY` tanımlayın. Anahtarı HTML / JS dosyasına koymayın. Bu entegrasyon canlı ortamda uçtan uca doğrulanmamıştır; API veri formatı veya erişim politikası değişirse uyarlama gerekebilir.

## Kadro

Steam grubunun herkese açık üyeler ekranında 12 toplam üye bilgisi, 11 görüntülenebilir hesap bulunuyordu (12 Kasım 2026). Doğrulanan 11 oyuncunun linkleri kodda kayıtlıdır. Steam'in gizlilik ve erişim kısıtlarından dolayı eksik 12'nci hesabı tahmin etmiyoruz. Kodda `api/_shared.js` ve `public/app.js` içinde eşleşen oyuncu listeleri bulunur. Kadro otomatik yeni üye eklemez: listede otomatik değişiklik ve doğru isimlerle eşleşme istenirse ayrı bir server-side Steam API entegrasyonu gerekir.

## Discord

Discord kullanıcı ID'si `847421929266610176` önceden `public/app.js` içinde `DISCORD_USER_ID` olarak tanımlıdır, tekrar girmeniz gerekmez. Takım Discord davet adresi Steam grubunun gerçek bağlantısından alınmıştır: https://discord.gg/a9Xe6QxcTE . Discord kullanıcı durum takibi henüz yapılmaz; yeni site maç odaklıdır.

## Testler

Node.js bulunan bir cihazda `npm test` çalıştırın. Testler dosya ve şema kontrolleridir; gerçek Steam / Leetify ağ isteklerini doğrulamaz. Kaynaklar: Steam grup sayfası ve Leetify Public CS API belgeleri.
