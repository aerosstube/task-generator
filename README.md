# Генерация Word-документов из GitLab Merge Requests

Этот проект позволяет генерировать Word-документы на основе списка Merge Requests (MR) из GitLab. Документы содержат информацию о задачах и ссылках на Merge Requests, а также генерируются с учетом выбранного автора и диапазона дат.

## Установка

### 1. Установите зависимости

Перейдите в директорию проекта и установите все зависимости, указанные в `package.json`:

```bash
npm install
```

### 2. Настройка

Создайте файл `config.js` в корневой директории проекта и добавьте следующие параметры:

```javascript
export const GITLAB_TOKEN = 'your_gitlab_token';
export const GITLAB_HOST = 'your_gitlab_host'; // например, 'gitlab.com' или 'gitlab.example.com'
export const GITLAB_URL = `https://${GITLAB_HOST}/api/v4`;
```

Замените `your_gitlab_token` и `your_gitlab_host` на ваш реальный GitLab токен и хост.

## Использование

### Шаг 1. Запустите скрипт

Для запуска программы используйте следующую команду:

```bash
npm start
```

### Шаг 2. Выбор параметров

1. **Проект**: После запуска вам будет предложено выбрать проект, для которого нужно получить список Merge Requests (либо по всем проектом).
2. **Автор**: После выбора проекта, вы сможете выбрать автора, чьи Merge Requests будут использоваться для генерации документа.
3. **Диапазон дат**: Укажите начальную и конечную даты для фильтрации Merge Requests.

### Шаг 3. Генерация документа

После ввода всех данных скрипт создаст Word-документ, содержащий список Merge Requests. Документ будет сохранен в папке `documents` с названием:

```
Документ для задач <Имя_Автора> <Дата>.docx
```

## Пример использования

После выбора всех параметров программа создаст документ в папке `documents`, где содержится таблица с информацией о Merge Requests:

- **№**: Номер задачи.
- **Код**: Название ветки.
- **Краткое описание**: Описание задачи из Merge Request.
- **Решение**: Ссылка на Merge Request.
- **Период**: Дата последнего обновления Merge Request.
