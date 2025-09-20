import requests
from bs4 import BeautifulSoup
import json
import csv
from datetime import datetime

def scrape_caedu_multibonus():
    # Configurar headers para simular um navegador real
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    url = 'https://www.caedu.com.br/assistencia-pet'
    
    try:
        # Fazer a requisição para o site
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Verifica se a requisição foi bem-sucedida
        
        # Parse do conteúdo HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Dicionário para armazenar os dados coletados
        data = {
            'url': url,
            'timestamp': datetime.now().isoformat(),
            'title': '',
            'meta_description': '',
            'text_content': [],
            'links': [],
            'images': [],
            'products': [],
            'promotions': []
        }
        
        # Extrair título da página
        if soup.title:
            data['title'] = soup.title.string
        
        # Extrair meta descrição
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            data['meta_description'] = meta_desc['content']
        
        # Extrair texto do conteúdo principal (ajustar seletores conforme necessário)
        main_content = soup.find('main') or soup.body
        if main_content:
            # Extrair parágrafos de texto
            paragraphs = main_content.find_all('p')
            for p in paragraphs:
                text = p.get_text().strip()
                if text and len(text) > 10:  # Filtrar textos muito curtos
                    data['text_content'].append(text)
            
            # Extrair links
            links = main_content.find_all('a', href=True)
            for link in links:
                href = link['href']
                text = link.get_text().strip()
                if href and not href.startswith('javascript:'):
                    data['links'].append({
                        'text': text,
                        'url': href if href.startswith('http') else url + href.lstrip('/')
                    })
            
            # Extrair imagens
            images = main_content.find_all('img', src=True)
            for img in images:
                src = img['src']
                alt = img.get('alt', '')
                data['images'].append({
                    'alt': alt,
                    'src': src if src.startswith('http') else url + src.lstrip('/')
                })
        
        # Tentar identificar produtos (ajustar seletores conforme a estrutura real do site)
        product_elements = soup.select('.product, .card, .item')  # Seletores comuns para produtos
        for product in product_elements:
            try:
                name = product.select_one('h2, h3, .name, .title')
                price = product.select_one('.price, .value, .cost')
                
                if name:
                    product_data = {
                        'name': name.get_text().strip(),
                        'price': price.get_text().strip() if price else 'Não informado'
                    }
                    data['products'].append(product_data)
            except:
                continue
        
        # Tentar identificar promoções (ajustar seletores conforme necessário)
        promo_elements = soup.select('.promotion, .banner, .offer')
        for promo in promo_elements:
            try:
                title = promo.select_one('h2, h3, .title')
                description = promo.select_one('p, .description')
                
                if title:
                    promo_data = {
                        'title': title.get_text().strip(),
                        'description': description.get_text().strip() if description else ''
                    }
                    data['promotions'].append(promo_data)
            except:
                continue
        
        return data
        
    except requests.RequestException as e:
        print(f"Erro ao acessar o site: {e}")
        return None

def save_data(data, format='json'):
    """Salva os dados coletados em diferentes formatos"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    if format == 'json':
        filename = f"caedu_multibonus_{timestamp}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Dados salvos em {filename}")
    
    elif format == 'csv':
        # Salvar produtos em CSV
        if data['products']:
            filename = f"caedu_products_{timestamp}.csv"
            with open(filename, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(['Nome', 'Preço'])
                for product in data['products']:
                    writer.writerow([product['name'], product['price']])
            print(f"Produtos salvos em {filename}")
        
        # Salvar promoções em CSV
        if data['promotions']:
            filename = f"caedu_promotions_{timestamp}.csv"
            with open(filename, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(['Título', 'Descrição'])
                for promo in data['promotions']:
                    writer.writerow([promo['title'], promo['description']])
            print(f"Promoções salvas em {filename}")

if __name__ == "__main__":
    print("Coletando dados do site Caedu Multibônus...")
    website_data = scrape_caedu_multibonus()
    
    if website_data:
        print("Dados coletados com sucesso!")
        print(f"Título: {website_data['title']}")
        print(f"Descrição: {website_data['meta_description']}")
        print(f"Encontrados {len(website_data['products'])} produtos")
        print(f"Encontradas {len(website_data['promotions'])} promoções")
        
        # Salvar dados em JSON
        save_data(website_data, 'json')
        
        # Salvar dados estruturados em CSV também
        save_data(website_data, 'csv')
        
        print("\nAgora você pode usar esses dados para criar material de treinamento com IA!")
    else:
        print("Falha ao coletar dados do site.")