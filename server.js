const x = require('express');
const y = require('pg');
const z = require('cors');
const fs = require('fs');

const a = x();
const b = 3001;

a.use(z());
a.use(x.json({ limit: '50mb' }));
const c = new y.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'recipes_db',
  password: 'Fathi#98843',
  port: 5432,
});

async function d() {
  try {
    await c.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        cuisine VARCHAR(255),
        title VARCHAR(500),
        rating FLOAT,
        prep_time INTEGER,
        cook_time INTEGER,
        total_time INTEGER,
        description TEXT,
        nutrients JSONB,
        serves VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Table created successfully');
  } catch (err) {
    console.error('Table creation error:', err);
  }
}

function e(val) {
  if (val === 'NaN' || val === null || val === undefined || isNaN(val)) {
    return null;
  }
  return val;
}

function f(str) {
  if (typeof str !== 'string') return null;
  const match = str.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

async function g() {
  try {
    const h = JSON.parse(fs.readFileSync('recipes.json', 'utf8'));
    
    for (const i of h) {
      const j = e(i.rating);
      const k = e(i.prep_time);
      const l = e(i.cook_time);
      const m = e(i.total_time);
      
      let n = null;
      if (i.nutrients) {
        n = {
          calories: f(i.nutrients.calories),
          carbohydrateContent: f(i.nutrients.carbohydrateContent),
          cholesterolContent: f(i.nutrients.cholesterolContent),
          fiberContent: f(i.nutrients.fiberContent),
          proteinContent: f(i.nutrients.proteinContent),
          saturatedFatContent: f(i.nutrients.saturatedFatContent),
          sodiumContent: f(i.nutrients.sodiumContent),
          sugarContent: f(i.nutrients.sugarContent),
          fatContent: f(i.nutrients.fatContent)
        };
      }
      
      await c.query(`
        INSERT INTO recipes (cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [i.cuisine, i.title, j, k, l, m, i.description, JSON.stringify(n), i.serves]);
    }
    
    console.log(`Loaded ${h.length} recipes`);
  } catch (err) {
    console.error('Data loading error:', err);
  }
}

a.get('/api/recipes', async (req, res) => {
  try {
    const o = parseInt(req.query.page) || 1;
    const p = parseInt(req.query.limit) || 10;
    const q = (o - 1) * p;
    
    const r = await c.query('SELECT COUNT(*) FROM recipes');
    const s = parseInt(r.rows[0].count);
    
    const t = await c.query(`
      SELECT * FROM recipes 
      ORDER BY rating DESC NULLS LAST 
      LIMIT $1 OFFSET $2
    `, [p, q]);
    
    res.json({
      page: o,
      limit: p,
      total: s,
      data: t.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

a.get('/api/recipes/search', async (req, res) => {
  try {
    let u = 'SELECT * FROM recipes WHERE 1=1';
    const v = [];
    let w = 1;
    
    if (req.query.title) {
      u += ` AND title ILIKE $${w}`;
      v.push(`%${req.query.title}%`);
      w++;
    }
    
    if (req.query.cuisine) {
      u += ` AND cuisine ILIKE $${w}`;
      v.push(`%${req.query.cuisine}%`);
      w++;
    }
    
    if (req.query.rating) {
      const ratingQuery = req.query.rating;
      if (ratingQuery.startsWith('>=')) {
        u += ` AND rating >= $${w}`;
        v.push(parseFloat(ratingQuery.slice(2)));
      } else if (ratingQuery.startsWith('<=')) {
        u += ` AND rating <= $${w}`;
        v.push(parseFloat(ratingQuery.slice(2)));
      } else if (ratingQuery.startsWith('>')) {
        u += ` AND rating > $${w}`;
        v.push(parseFloat(ratingQuery.slice(1)));
      } else if (ratingQuery.startsWith('<')) {
        u += ` AND rating < $${w}`;
        v.push(parseFloat(ratingQuery.slice(1)));
      } else {
        u += ` AND rating = $${w}`;
        v.push(parseFloat(ratingQuery));
      }
      w++;
    }
    
    if (req.query.total_time) {
      const timeQuery = req.query.total_time;
      if (timeQuery.startsWith('>=')) {
        u += ` AND total_time >= $${w}`;
        v.push(parseInt(timeQuery.slice(2)));
      } else if (timeQuery.startsWith('<=')) {
        u += ` AND total_time <= $${w}`;
        v.push(parseInt(timeQuery.slice(2)));
      } else if (timeQuery.startsWith('>')) {
        u += ` AND total_time > $${w}`;
        v.push(parseInt(timeQuery.slice(1)));
      } else if (timeQuery.startsWith('<')) {
        u += ` AND total_time < $${w}`;
        v.push(parseInt(timeQuery.slice(1)));
      } else {
        u += ` AND total_time = $${w}`;
        v.push(parseInt(timeQuery));
      }
      w++;
    }
    
    if (req.query.calories) {
      const calQuery = req.query.calories;
      if (calQuery.startsWith('>=')) {
        u += ` AND CAST(nutrients->>'calories' AS FLOAT) >= $${w}`;
        v.push(parseFloat(calQuery.slice(2)));
      } else if (calQuery.startsWith('<=')) {
        u += ` AND CAST(nutrients->>'calories' AS FLOAT) <= $${w}`;
        v.push(parseFloat(calQuery.slice(2)));
      } else if (calQuery.startsWith('>')) {
        u += ` AND CAST(nutrients->>'calories' AS FLOAT) > $${w}`;
        v.push(parseFloat(calQuery.slice(1)));
      } else if (calQuery.startsWith('<')) {
        u += ` AND CAST(nutrients->>'calories' AS FLOAT) < $${w}`;
        v.push(parseFloat(calQuery.slice(1)));
      } else {
        u += ` AND CAST(nutrients->>'calories' AS FLOAT) = $${w}`;
        v.push(parseFloat(calQuery));
      }
      w++;
    }
    
    u += ' ORDER BY rating DESC NULLS LAST';
    
    const result = await c.query(u, v);
    
    res.json({
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

a.listen(b, async () => {
  console.log(`🚀 Server running on port ${b}`);
  await d();
  
  try {
    const result = await c.query('SELECT COUNT(*) FROM recipes');
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      console.log('📥 No data found, loading sample recipes...');
      await g();
    } else {
      console.log(`📊 Found ${count} recipes in database`);
    }
  } catch (err) {
    console.error('Error checking data:', err);
  }
});

module.exports = a;